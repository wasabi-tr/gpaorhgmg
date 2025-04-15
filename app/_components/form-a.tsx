"use client";
import { submitForm } from "./form-a/actions";
import { useActionState } from "react";

export default function FormA() {
  const [state, formAction] = useActionState(submitForm, null);

  return (
    <div className="flex gap-6 w-full mx-auto p-6">
      <div className="w-[500px]">
        <h1 className="text-xl font-bold mb-4">
          キャンペーンと商品の紐付け（検証用）
        </h1>
        {state?.message && (
          <div
            className={`mb-4 p-3 rounded ${
              state.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {state.message}
          </div>
        )}
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="campaignId" className="block mb-1 font-medium">
              キャンペーンID
            </label>
            <input
              id="campaignId"
              name="campaignId"
              type="text"
              className="w-full p-2 border rounded"
              placeholder="キャンペーンIDを入力"
              required
            />
          </div>

          <div>
            <label htmlFor="productIds" className="block mb-1 font-medium">
              商品ID（改行区切りで複数入力可）
            </label>
            <textarea
              id="productIds"
              name="productIds"
              className="w-full p-2 border rounded h-32"
              placeholder="商品IDを入力（複数の場合は改行で区切ってください）"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            送信する
          </button>
        </form>
      </div>

      <div className="flex-1/2 bg-gray-50 p-4 rounded-lg border">
        <h2 className="text-lg font-bold mb-3">操作手順</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            キャンペーンIDには
            <a
              href="https://maf8ibsb9h.microcms.io/apis/cp-a"
              className=" text-blue-700 underline"
            >
              CP概要
            </a>
            で登録したキャンペーンのコンテンツIDを入力します。（例：brv5ki0u7px）
          </li>
          <li>
            マスターDBの商品IDを入力してください。複数の商品にキャンペーンを紐づける場合は、商品IDを1行に1つずつ入力してください。（例:
            4973655812136）
          </li>
          <li>
            「送信する」ボタンをクリックして、キャンペーンと商品の紐付けを行います。
          </li>
        </ol>
        <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-100">
          <h3 className="font-medium mb-1">注意事項</h3>
          <ul className="list-disc pl-5 text-sm">
            <li>
              <a
                href="https://maf8ibsb9h.microcms.io/apis/desc-cp-a"
                className=" text-blue-700 underline"
              >
                商品説明 - CP
              </a>
              に登録されているキャンペーンを更新するフォームです
            </li>
            <li>
              MVPであるため、CP概用が未登録のケースや失敗時のコールバック、ロギングなどは考慮していません
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
