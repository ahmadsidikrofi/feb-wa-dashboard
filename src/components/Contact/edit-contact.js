"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Contact2, FileEditIcon, LoaderIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { toast } from 'sonner';

export const contactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phoneNumber: z.string()
    .min(9, "Nomor tujuan terlalu pendek")
    .max(15, "Nomor whatsapp terlalu panjang")
    .regex(/^[0-9]+$/, "Nomor WhatsApp hanya boleh berisi angka.")
    .refine(value => !value.startsWith("62"), {
      message: "Nomor WhatsApp tidak boleh diawali dengan 62 atau 0."
    }),
  notes: z.string().min(1, "Catatan wajib diisi"),
})


const EditContact = ({ contact, getContacts }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name ?? "",
      phoneNumber: contact?.phoneNumber?.replace(/^62/, "") ?? "",
      notes: contact?.notes ?? "",
      title: ""
    }
  })

  const handleEditContact = async () => {

  }

  useEffect(() => {
    if (contact) {
      form.reset({
        name: contact.name ?? "",
        phoneNumber: contact.phoneNumber?.replace(/^62/, "") ?? "",
        notes: contact.notes ?? "",
        title: contact.title ?? "",
      })
    }
  }, [contact])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-left" size="sm">
          <FileEditIcon className='size-4' /> Edit kontak
        </Button>
      </DialogTrigger>


      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ubah kontak penerima reminder</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id="contact-form" onSubmit={form.handleSubmit(handleEditContact)} className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1 space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama kontak</FormLabel>
                  <FormControl>
                    <Input placeholder="Cth: Royal Ignatius" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="81234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Dosen S1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button type="submit" form="contact-form" disabled={isLoading}>
            {isLoading ?
              <div className="flex justify-center items-center text-center gap-2 ">
                <LoaderIcon className="animate-spin size-4" /> <span>Mengubah kontak...</span>
              </div>
              : "Edit kontak"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditContact