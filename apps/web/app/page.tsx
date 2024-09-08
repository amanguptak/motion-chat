import Message from "./components/message";
export default function Home() {
  return (
    <div className=" text-center  ">
      <p className="text-3xl p-4 text-green-500 font-bold">Motion chat</p>

      <Message />
    </div>
  );
}
