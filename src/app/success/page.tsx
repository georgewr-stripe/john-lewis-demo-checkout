"use client";

import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();
  return (
    <>
      <h1>Payment Succeeded</h1>
      <button onClick={() => router.push("/")}>Go Again</button>
    </>
  );
};

export default SuccessPage;
