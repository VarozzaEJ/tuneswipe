import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea"
import {musicPostsService} from "../services/MusicPostsService.js"
import emailjs from '@emailjs/browser';


type FormData = {
    description?: string;
    type?: string;
    postId?: string;
    postCreatorName?: string;
    postCreatorPicture?: string;
    firstName?: string;
    email?: string;
    bugOrPost?: string;
    descriptionString?: string;
    postIdString?: string;
    postCreatorNameString?: string;
    typeString?: string;
}

const formSchema : ZodType<FormData> = z.object({
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters"
  }),
 type: z.enum(["vulgar language", "nudity", "harassment", "other"]),
 postId: z.string().optional(),
 postCreatorName: z.string().optional(),
 postCreatorPicture: z.string().optional(),
 firstName: z.string().optional(),
 email: z.string().email().optional(),
 bugOrPost: z.string().optional(),
 descriptionString: z.string().optional(),
 postIdString: z.string().optional(),
 postCreatorNameString: z.string().optional(),
 typeString: z.string().optional(),
});

export default function ReportPostForm({postId, postCreator, handler, handler2, postCreatorPicture}) {
    // const {handleSubmit, register, resetField, setValue, getValues} = useForm<FormData>({resolver: zodResolver(formSchema)})
     const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })



    async function onSubmit(data: z.infer<typeof formSchema>) {
        data.postId = postId
        data.postCreatorName = postCreator
        data.postCreatorPicture = postCreatorPicture
        data.bugOrPost = "Post"
        console.log(data)
        const report = await musicPostsService.reportPost(data)
        if(report) {
            toast.success("Report Recieved!")
            data.firstName = report.creator.name
            data.email = report.creator.email
            data.descriptionString = "Description: "
            data.postIdString = "Post Id: "
            data.postCreatorNameString = "Post Creator: "
            data.typeString = "Type: "
            handler()
            handler2()
            emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {...data}, {publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY}).then(() => {}).catch((err) => {console.log(err)})
        } else {
            toast.error("Error!")
        }
    }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
              <FormItem className="space-y-3">
              <FormLabel></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="nudity" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Nudity
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="harrassment" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Harassment
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="vulgar language" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Vulgar Language
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="other" />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField control={form.control} 
          name='description' 
          render = {({field}) => (
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea className=' bg-slate-800' placeholder='Describe why you are reporting this post' 
                    {...field}/>
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
          />
          <div className='w-full flex justify-end'>
        <Button type="submit">Submit</Button>
          </div>
      </form>
    </Form>
          </>
  )
}
