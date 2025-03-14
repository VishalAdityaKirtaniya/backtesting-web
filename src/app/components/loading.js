import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className='w-full h-full flex justify-center gap-3 items-center'>
      <Image
        className='animate-spin'
        src='/loading.svg'
        alt='Loading'
        width={30}
        height={30}
      />
      <p className='text-center text-gray-600'>Loading results...</p>
    </div>
  );
};

export default Loading;
