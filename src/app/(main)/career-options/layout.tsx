


export default function CareerPathLayout({children}:{children:React.ReactNode}){

  return (
    <div className="px-5 space-y-4 ">
      <div className="flex items-center justify-between mb-5 ">
        <h1 className=" text-[44px]  md:text-6xl font-bold gradient-title text-wrap">Recommended Career Options</h1>
      </div>
      
        {children}
    
    </div>
  );
 
}