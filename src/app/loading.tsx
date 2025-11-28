// app/loading.tsx (or components/Loading.tsx)

import { Loader2 } from 'lucide-react';
import React from 'react';


export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-background z-1000">
   <div className="loader">
     <div className="square" id="sq1" />
        <div className="square" id="sq2" />
        <div className="square" id="sq3" />
        <div className="square" id="sq4" />
        <div className="square" id="sq5" />
        <div className="square" id="sq6" />
        <div className="square" id="sq7" />
        <div className="square" id="sq8" />
        <div className="square" id="sq9" />
</div>
    </div>
  );
}