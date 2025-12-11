import { v4 as uuidv4 } from 'uuid';

import type { TChannel } from '@/src/shared/hooks/useAlarm';
import type { INotificationDetailData } from '@/src/shared/types';

type TClient = {
  id: string;
  controller: ReadableStreamDefaultController;
  channels: TChannel[] | null; // null = all
  userId?: string; // optional mapped userId after auth
};

const encoder = new TextEncoder();

// Use globalThis to keep singletons across module reloads (dev/HMR or multiple module instances)
const gw = globalThis as any;
if (!gw.__alarm_clients) gw.__alarm_clients = new Map<string, TClient>();
if (!gw.__alarm_pendingAcks) gw.__alarm_pendingAcks = new Map<string, Set<string>>();

const clients: Map<string, TClient> = gw.__alarm_clients;
const pendingAcks: Map<string, Set<string>> = gw.__alarm_pendingAcks;

// Helper to log with prefix
function log(...args: any[]) {
  try {
    console.log('[alarm]', ...args);
  } catch {
    // ignore
  }
}

function makeEvent(eventId: string, event: string, data: INotificationDetailData): string {
  return `id: ${eventId}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export function addClient(client: TClient): void {
  clients.set(client.id, client);
  log('addClient', {
    clientId: client.id,
    channels: client.channels,
    userId: client.userId,
    totalClients: clients.size,
  });
}

export function removeClient(id: string): void {
  const existed = clients.delete(id);
  log('removeClient', { clientId: id, removed: existed, totalClients: clients.size });
}

export function setClientUserId(clientId: string, userId: string): void {
  const c = clients.get(clientId);
  if (!c) {
    log('setClientUserId: client not found', { clientId, userId });
    return;
  }
  c.userId = userId;
  clients.set(clientId, c);
  log('setClientUserId', { clientId, userId });
}

export function listClients(): { id: string; channels: TChannel[] | null; userId?: string }[] {
  return Array.from(clients.values()).map(c => ({ id: c.id, channels: c.channels, userId: c.userId }));
}

export function getClient(id: string): TClient | undefined {
  return clients.get(id);
}

export function notify(payload: INotificationDetailData, opts?: { channel?: TChannel; userId?: string }): void {
  const eventId = `${Date.now()}-${uuidv4()}`;
  const channel = opts?.channel ?? 'generic';
  const eventStr = makeEvent(eventId, channel, { ...payload });

  log('notify called', { payload, opts, totalClientsBefore: clients.size });

  // Debug clients snapshot
  log(
    'clients snapshot',
    Array.from(clients.values()).map(c => ({ id: c.id, userId: c.userId, channels: c.channels })),
  );

  clients.forEach(client => {
    const matchUser = opts?.userId ? client.userId === opts.userId : true;
    const matchChannel = client.channels === null || client.channels.includes(channel as TChannel);
    if (matchUser && matchChannel) {
      try {
        client.controller.enqueue(encoder.encode(eventStr));
        log('notify sent to client', { clientId: client.id, channel, notifyUserId: opts?.userId });
      } catch (err) {
        log('notify enqueue error, removing client', { clientId: client.id, err: String(err) });
        clients.delete(client.id);
      }
    }
  });

  // Track pending acks for user-level delivery
  if (opts?.userId && payload.id) {
    const set = pendingAcks.get(payload.id) ?? new Set<string>();
    set.add(opts.userId);
    pendingAcks.set(payload.id, set);
    log('pendingAcks updated', { notificationId: payload.id, pendingFor: Array.from(set) });
  }
}

export function ackNotification(notificationId: string, userId: string): boolean {
  const set = pendingAcks.get(notificationId);
  if (!set) {
    log('ackNotification: no pending set', { notificationId, userId });
    return false;
  }
  set.delete(userId);
  if (set.size === 0) {
    pendingAcks.delete(notificationId);
  } else {
    pendingAcks.set(notificationId, set);
  }
  log('ackNotification', { notificationId, userId, remaining: set.size });
  return true;
}

export function getPendingAcks(notificationId: string): Set<string> {
  return pendingAcks.get(notificationId) ?? new Set<string>();
}

export default {
  addClient,
  removeClient,
  setClientUserId,
  listClients,
  getClient,
  notify,
  ackNotification,
  getPendingAcks,
};
