import React from "react";

type Props = {};

const PdfRender = (props: Props) => {
  return (
    <div className="full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>
    </div>
  );
};

export default PdfRender;
