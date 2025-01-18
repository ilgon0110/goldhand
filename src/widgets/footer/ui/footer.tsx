import Image from "next/image";
import Link from "next/link";
import { gowunDodumFont } from "@/src/shared/fonts";

export const Footer = () => {
  return (
    <footer className="bg-white mt-20 border-t border-gray-300">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-10 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 flex flex-col justify-center items-center xl:block">
            <div className="flex flex-row items-center space-x-2">
              <Image
                width={32}
                height={32}
                src="/favicon-96x96.png"
                alt="고운황금손"
              />
              <span
                className={`${gowunDodumFont.className} text-gray-700 font-bold`}
              >
                고운황금손
              </span>
            </div>
            <div className="space-y-2 text-center xl:text-start">
              <div className="flex flex-row space-x-2 justify-center items-center xl:justify-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#728146"
                >
                  <path d="M760-480q0-117-81.5-198.5T480-760v-80q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480h-80Zm-160 0q0-50-35-85t-85-35v-80q83 0 141.5 58.5T680-480h-80Zm198 360q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                </svg>
                <p className="text-balance text-[#728146] text-lg">
                  010-8381-0431
                </p>
              </div>
              <div>
                <p className="text-balance text-sm/6 text-gray-600">
                  궁금하신 점 또는 문의 사항이 있으시면 언제든지 연락해주세요.
                </p>
                <p className="text-balance text-sm/6 text-gray-600 mt-2">
                  대표 : 차복규
                </p>
                <p className="text-balance text-sm/6 text-gray-600">
                  {`경기도 화성시 향남읍 상신하길로328번길 26(하길리 1467) 505호`}
                </p>
                <p className="text-balance text-sm/6 text-gray-600">
                  사업자등록번호 : 614-94-02053
                </p>
              </div>
            </div>
            {/* <div className="flex gap-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <span className="sr-only">X</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div> */}
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm/6 font-semibold text-gray-900">
                산후관리사
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm/6 text-gray-600 hover:text-gray-900"
                  >
                    산후관리사란?
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm/6 text-gray-600 hover:text-gray-900"
                  >
                    산후관리사가 하는 일
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm/6 text-gray-600 hover:text-gray-900"
                  >
                    산후관리사 준수사항
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:mt-0">
              <h3 className="text-sm/6 font-semibold text-gray-900">
                이용안내
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm/6 text-gray-600 hover:text-gray-900"
                  >
                    대여물품
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm/6 text-gray-600 hover:text-gray-900"
                  >
                    이용물품
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm/6 text-gray-600 hover:text-gray-900"
                  >
                    정부바우처
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm/6 font-semibold text-gray-900">
                예약상담
              </h3>
            </div>
            <div className="md:mt-0">
              <h3 className="text-sm/6 font-semibold text-gray-900">
                이용후기
              </h3>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8">
          <p className="text-sm/6 text-gray-600">
            &copy; 2024 고운황금손, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
