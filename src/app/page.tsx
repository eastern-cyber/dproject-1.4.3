// src/app/page.tsx

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import dprojectIcon from "../../public/DProjectLogo_650x600.svg";
import { getContractMetadata } from "thirdweb/extensions/common";
import { contract } from "../../utils/contracts";
import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";
import Footer from "@/components/Footer";

function HomeInner() {
  const account = useActiveAccount();
  const { theme } = useTheme();
  const searchParams = useSearchParams();

  // Forward any ?referrerId= coming from the Django profile page
  // (e.g. 3kok.dfi.fund -> dfi.fund, or any inbound referral link)
  const referrerId = searchParams.get("referrerId") ?? "";
  const memberAreaHref = referrerId
    ? `/member-area?referrerId=${encodeURIComponent(referrerId)}`
    : "/member-area";

  const { data: contractMetadata } = useReadContract(
    getContractMetadata,
    {
      contract: contract,
    }
  );

  if (!account) {
    return (
      <main className="min-h-screen w-full flex flex-col">
        <div
          className={
            theme === "dark"
              ? "bg-[#110033] text-amber-100"
              : "bg-gray-50 text-gray-900"
          }
        >
          <div className="grow flex flex-col items-center justify-center py-20 w-full">
            <Header referrerId={referrerId} />
            <div className="my-8 w-full flex justify-center">
              <ThirdwebResources referrerId={referrerId} />
            </div>
            <div className="w-full mt-8">
              <Footer />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="grow flex flex-col items-center justify-center p-5 w-full">
        <div className="flex flex-col items-center justify-center p-5 border border-gray-300 rounded-lg max-w-md w-full">
          <Image
            src={dprojectIcon}
            alt=""
            className="size-37.5 md:size-37.5 mb-6"
            style={{
              filter: "drop-shadow(0px 0px 24px #a726a9a8)",
            }}
          />
          <p className="pt-2">Version 1.4.3</p>
          <div className="flex justify-center mb-2">
            <WalletConnect />
          </div>
          {contractMetadata && (
            <div className="flex flex-col items-center justify-center p-5 mt-2 w-full">
              <div className="flex flex-col items-center justify-center mt-2 w-full">
                <p className="text-xl font-bold text-center">
                  ยินดีต้อนรับสู่ DProject
                </p>
                <div className="mt-5 w-full">
                  <Link
                    href={memberAreaHref}
                    className="flex flex-col border bg-zinc-800 border-zinc-500 px-4 py-3 rounded-lg hover:bg-[#6890000] transition-colors hover:border-zinc-300 w-full text-center"
                  >
                    <span className="text-lg wrap-break-words block">
                      เข้าสู่พื้นที่สมาชิก
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 w-full max-w-4xl flex justify-center">
          <ThirdwebResources referrerId={referrerId} />
        </div>
        <div className="mt-8 w-full max-w-4xl">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </main>
      }
    >
      <HomeInner />
    </Suspense>
  );
}

function Header({ referrerId }: { referrerId: string }) {
  // The public homepage keeps a stable "/" href. We deliberately do NOT
  // append ?referrerId= to "/" because the root page doesn't consume it.
  // If you later add a "Login" flow that needs it, forward via:
  //   const loginHref = referrerId ? `/?referrerId=${referrerId}` : "/";
  return (
    <header className="flex flex-col items-center w-full mb-8">
      <Link href="/" passHref>
        <Image
          src={dprojectIcon}
          alt="DProject"
          className="size-37.5 md:size-37.5"
          style={{
            filter: "drop-shadow(0px 0px 24px #a726a9a8)",
          }}
        />
      </Link>
      <p className="my-4"></p>
      <p className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-800 text-center">
        <span className="inline-block text-blue-500"> DProject </span>
        &nbsp;&nbsp;&nbsp;
        <span className="inline-block -skew-x-6 text-gray-500"> Login </span>
        &nbsp;
        <span className="text-zinc-400 inline-block mx-1"> + </span>
        &nbsp;
        <span className="inline-block -skew-x-6 text-gray-500"> Register </span>
      </p>
      <p className="text-xl text-center text-zinc-400 mb-6">
        Version 1.4.3
      </p>
      <p className="text-center text-zinc-500 text-base mb-8 max-w-2xl px-4">
        ล็อกอินด้วยอีเมลล์{" "}
        <code className="bg-zinc-800 text-zinc-500 px-2 rounded py-1 text-sm mx-1">
          OTP
        </code>{" "}
        e-mail Login
      </p>
      <WalletConnect />
      {/* Optional: show the inbound referral wallet so users see it survived the hop */}
      {referrerId && (
        <p className="mt-4 text-sm text-zinc-500 break-all text-center">
          Referral: <span className="text-yellow-500">{referrerId}</span>
        </p>
      )}
    </header>
  );
}

function ThirdwebResources({ referrerId }: { referrerId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl px-4">
      <ArticleCard
        title="เกี่ยวกับโครงการ DProject"
        href="/about"
        description="More detail about DProject"
        referrerId={referrerId}
      />

      <ArticleCard
        title="ต้นแบบ Application ก๊อกๆๆ"
        href="https://3kok.dfi.fund/"
        description="3K หรือ KokKokKok จะต่อยอดจาก SocialApp ยอดนิยม"
        referrerId={referrerId}
        external
      />

      <ArticleCard
        title="DProject Timeline"
        href="/timeline"
        description="แสดงรายละเอียดไทม์ไลน์และความคืบหน้าของโครงการ"
        referrerId={referrerId}
      />
    </div>
  );
}

function ArticleCard(props: {
  title: string;
  href: string;
  description: string;
  referrerId?: string;
  external?: boolean;
}) {
  // Build a query string that:
  //  1. Preserves any existing query in `props.href` (using & instead of ?)
  //  2. Always adds utm_source=next-template
  //  3. Optionally adds referrerId when present
  const buildHref = () => {
    const [base, existingQuery = ""] = props.href.split("?");
    const params = new URLSearchParams(existingQuery);

    params.set("utm_source", "next-template");
    if (props.referrerId) {
      params.set("referrerId", props.referrerId);
    }

    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <Link
      href={buildHref()}
      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700 h-full"
      target={props.external ? "_blank" : undefined}
      rel={props.external ? "noopener noreferrer" : undefined}
    >
      <article>
        <p className="text-lg text-yellow-500 font-semibold mb-2">{props.title}</p>
        <p className="text-sm text-zinc-500">{props.description}</p>
      </article>
    </Link>
  );
}