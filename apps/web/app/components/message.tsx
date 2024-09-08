"use client";

const Message = () => {
  return (
    <div className="m-4">
    {/* <form action=""></form> */}
     <input type="text" placeholder="Message..." className="px-4 py-2 rounded m-3" />
     <button className="px-3 py-2 bg-green-500 hover:bg-green-600 cursor-pointer text-white rounded-md">Send</button>
    </div>
  )
};

export default Message;
