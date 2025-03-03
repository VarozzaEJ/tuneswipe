import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { FormDescription } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { z, ZodType } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountService } from '../services/accountService.js'
import {musicPostsService} from '../services/musicPostsService'
import emailjs from '@emailjs/browser';
import { toast } from 'sonner'

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID

type FormData = {
    email: string;
    description: string;
    reproduction: string;
    file: null;
}

console.log(publicKey)
console.log(templateId)
console.log(serviceId)
export default function ReportBugForm({setReportBugDialogOpen}) {
    const [pictureString, setPictureString] = useState("")

    const formSchema : ZodType<FormData> = z.object({
        email: z.string().email("Invalid email address"),
        description: z.string({message: "Description is required"}).min(15, "Description must be at least 15 characters long").max(250, "Description must be at most 250 characters long"),
        reproduction: z.string({message: "Steps to reproduce is required"}).min(15, "Reproduction steps must be at least 15 characters long").max(500, "Reproduction steps must be at most 500 characters long"),
        file: z.any().optional()
     })

     const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) })

     const submitForm = async (data : FormData) => {
        if(data.file) {
              const fileUrl = await musicPostsService.getFileUrl(data.file[0])
              console.log('🌆', fileUrl)
              data.file = fileUrl
            } 
        await accountService.reportBug(data)
        console.log(data.file)
        emailjs.send(serviceId, templateId, {...data}, {publicKey: publicKey}).then(() => {toast.success("Thank you for helping us improve the TuneSwipe experience!")}).catch((err) => {console.log(err)})
        setReportBugDialogOpen(false)
     }

    function selectFile(e) {
    try {
        const file = e.target.files[0]
        console.log(file)
        setPictureString(URL.createObjectURL(file)) 
    }
    catch (error) {
        console.error(error)
    }
    }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
        <Label  htmlFor="email">Your Email</Label>
        {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
        <Input {...register("email")} className='mb-3 border-0 active:border-0 mt-1 bg-slate-950' id="email" type="email" placeholder='e.g. example@gmail.com' />

        <Label htmlFor="description">Brief Description</Label>
        {errors.description && <p className='text-destructive text-sm'>{errors.description.message}</p>}
        <Input {...register("description")} className='mb-3 border-0 focus-visible:ring-0 mt-1 bg-slate-950' id="description" type="text" placeholder='e.g. I am unable to login' />

        <Label htmlFor="reproduction">Steps to Reproduce</Label>
        {errors.reproduction && <p className='text-destructive text-sm'>{errors.reproduction.message}</p>}
        <p className={("text-sm text-slate-300 mb-2")}>Be as detailed as possible</p>
        <Textarea {...register("reproduction")} className='mb-3 border-0 focus-visible:ring-0 h-20 mt-1 bg-slate-950' id="reproduction"  placeholder='e.g. 1. Go to login page 2. Enter email and password 3. Click on login button' />

        <Label htmlFor="screenshot">Screenshot of Issue</Label>
        
        <div className="flex items-center justify-center w-full">
         <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48   rounded-lg cursor-pointer  bg-slate-950 ">
            {pictureString.length > 5 ? 
            <div>
                <img className='w-full h-40' src={pictureString} />
            </div>
            :
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            }
            <Input 
            
            {...register("file")}
            onInput={(e) => {
                selectFile(e)
            }}
             id="dropzone-file" type="file"  accept="image/*" className="hidden" />
         </label>
        </div> 
        <div className='w-full mt-3 flex justify-end'>
            <Button type="submit">Submit</Button>
        </div>
    </form>
  )
}
