import type { Metadata } from "next";
import { MyDreamsBoard } from "@/components/dreams/MyDreamsBoard";

export const metadata: Metadata = {
  title: "My Dreams — Dreams Come True",
  description: "Your selected dreams, prioritised, with live progress and downloadable cards.",
};

export default function MyDreamsPage() {
  return <MyDreamsBoard />;
}
