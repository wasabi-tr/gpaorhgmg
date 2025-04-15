import Image from "next/image";
import Link from "next/link";
export default async function Home() {
  const testIds = [
    "4975149579327",
    "4975149579310",
    "4903266723255",
    "4973655812136",
  ];

  return (
    <div className="flex flex-col  justify-center h-screen gap-4">
      <h2 className="text-2xl font-bold">設計パターン1パフォーマンス検証</h2>
      <ul className="list-disc pl-5">
        {testIds.map((id) => (
          <li key={id} className="text-blue-500 underline">
            <Link href={`/products/${id}`} className="">
              商品コード：{id}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold">設計パターン2の更新ツール</h2>
      <Link href="/insert-form/2-a" className="text-blue-500 underline">
        設計パターン2-Aのコンテンツ登録ツール
      </Link>
    </div>
  );
}
