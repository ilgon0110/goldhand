"use client";

import { consultParams } from "@/src/shared/searchParams";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { formatDateToYMD } from "@/src/shared/utils";
import {
  ReservationCard,
  ReservationPagination,
} from "@/src/views/reservation";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Timestamp } from "firebase/firestore";
import { useQueryStates } from "nuqs";

type ReservationListPageProps = {
  data: {
    message: string;
    consultData:
      | {
          id: string;
          title: string;
          location: string;
          phoneNumber: string;
          secret: boolean;
          updatedAt: Timestamp;
          userId: string | null;
          content: string;
          createdAt: Timestamp;
          franchisee: string;
          name: string;
          bornDate: Date | null;
          password: string | null;
        }[]
      | null;
    totalDataLength: number;
  };
};

export const ReservationListPage = ({ data }: ReservationListPageProps) => {
  const [consultParam, setConsultParam] = useQueryStates(consultParams, {
    shallow: false,
  });

  const toggleHideSecret = (check: CheckedState) => {
    setConsultParam({
      hideSecret: check.toString(),
    });
  };

  console.log("data", data);

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="secret"
          className="md:w-6 md:h-6 w-4 h-4"
          defaultChecked={consultParam.hideSecret === "true"}
          onCheckedChange={(check) => toggleHideSecret(check)}
        />
        <label
          htmlFor="secret"
          className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          비밀글 안보기
        </label>
      </div>
      <div className="space-y-4 pt-4">
        {data.consultData?.map((item) => {
          return (
            <ReservationCard
              key={item.id}
              docId={item.id}
              title={item.title}
              author={item.userId ? "회원" : "비회원"}
              createdAt={formatDateToYMD(item.createdAt)}
              spot={item.franchisee}
              isSecret={item.secret}
              content={item.content}
            />
          );
        })}
      </div>
      <ReservationPagination
        dataLength={data.totalDataLength}
        maxColumnNumber={10}
        consultParam={consultParam}
        setConsultParam={setConsultParam}
      />
    </div>
  );
};
