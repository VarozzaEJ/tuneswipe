import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";

export default function ListenPageMusicCardLoading() {
  return (
    <>
    <div className='w-[260px] sm:w-[350px] h-[375px]'>
        <Card className="w-full max-w-md  bg-slate-800 text-white">
        <CardHeader className="px-0 pt-0">
          
          <Skeleton className="rounded-lg h-52 rounded-br-none rounded-bl-none sm:h-[350px] max-w-full"/>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 mt-5 grid-cols-12">
            <div className="sm:col-span-8 col-span-12 ">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <Skeleton className='w-30 h-3 mb-2'/>
                  <Skeleton className='w-40 mt-1 h-3 bg-slate-500'/>
                </div>
                <div className="col-span-12">
                    <span className="flex text-slate-500 cursor-pointer hover:text-slate-200 delay-75 transition-all ease-in-out">
                     
                    </span>
                </div>
              </div>
            </div>
            <div className="sm:col-span-4 col-span-12 flex justify-end  items-center">
              
            </div>
          </div>
          
        </CardContent>
      </Card>
      </div>
    </>
  )
}
