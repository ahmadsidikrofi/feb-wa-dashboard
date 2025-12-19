'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Contact2, LoaderIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ContactTable from '@/components/Contact/contact-table';

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

function TambahPenerimaPage() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Data dummy kontak
  const dummyContacts = [
    { id: 1, name: "Prof. Dr. Budiman", phoneNumber: "6281234567890@c.us", notes: "Dekan FEB", title: "Dekan" },
    { id: 2, name: "Dr. Siti Nurhaliza", phoneNumber: "6281234567891@c.us", notes: "Wadek I", title: "Wakil Dekan I" },
    { id: 3, name: "Ahmad Susanto, M.M.", phoneNumber: "6281234567892@c.us", notes: "Wadek II", title: "Wakil Dekan II" },
    { id: 4, name: "Dr. Lina Marlina", phoneNumber: "6281234567893@c.us", notes: "Kepala Prodi S1 Manajemen", title: "Kaprodi" },
    { id: 5, name: "Prof. Dr. Eko Prasetyo", phoneNumber: "6281234567894@c.us", notes: "Kepala Prodi S2 Manajemen", title: "Kaprodi" },
  ]
  
  const [contacts, setContacts] = useState(dummyContacts)

  const getContacts = () => {
    // Ambil dari localStorage
    if (typeof window !== 'undefined') {
      const storedContacts = JSON.parse(localStorage.getItem('reminderContacts') || '[]');
      setContacts([...dummyContacts, ...storedContacts]);
    }
  }


  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      notes: "",
      title: ""
    }
  })

  const createContact = async (values) => {
    const formattedPhoneNumber = `62${values.phoneNumber.replace(/^0+/, '')}@c.us`
    
    try {
      setIsLoading(true)
      
      // Simpan ke localStorage
      if (typeof window !== 'undefined') {
        const storedContacts = JSON.parse(localStorage.getItem('reminderContacts') || '[]');
        
        // Cek duplikasi
        const isDuplicate = storedContacts.some(contact => contact.phoneNumber === formattedPhoneNumber) ||
                           dummyContacts.some(contact => contact.phoneNumber === formattedPhoneNumber);
        
        if (isDuplicate) {
          toast.error("Kontak dengan nomor telepon ini sudah ada.", {
            style: { background: "#fee2e2", color: "#991b1b" },
            className: "border border-red-500"
          })
          return;
        }
        
        const newContact = {
          id: Date.now(),
          name: values.name,
          phoneNumber: formattedPhoneNumber,
          notes: values.notes,
          title: values.title
        };
        
        storedContacts.push(newContact);
        localStorage.setItem('reminderContacts', JSON.stringify(storedContacts));
        
        getContacts()
        form.reset()
        setOpen(false)
        toast.success("Kontak berhasil ditambahkan", {
          style: { background: "#059669", color: "#d1fae5" },
          className: "border border-emerald-500"
        })
      }
    } catch (error) {
      console.log("Error creating contact:", error)
      toast.error("Kontak gagal ditambahkan", {
        style: { background: "#fee2e2", color: "#991b1b" },
        className: "border border-red-500"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getContacts()
  }, [])

  return (
    <section className='space-y-6'>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-sm:flex-col sm:flex-col lg:flex-row items-start mt-1 gap-3">
          <Contact2 className="size-10 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-600">Kumpulan Penerima Reminder</h1>
            <p className="text-muted-foreground">
              Daftar penerima reminder yang telah ditambahkan
            </p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className='relative flex gap-2'>
            {/* <Input className="w-full" placeholder="Cari kontak penerima" /> */}
            <DialogTrigger asChild>
              <Button className=" sm:w-auto">+ Tambah kontak</Button>
            </DialogTrigger>
          </div>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Buat kontak penerima reminder</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form id="contact-form" onSubmit={form.handleSubmit(createContact)} className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1 space-y-2">
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
                        <Input placeholder="Dosen S1 Adbis" {...field} />
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
                    <LoaderIcon className="animate-spin size-4" /> <span>Menambahkan kontak...</span>
                  </div>
                  : "Tambahkan kontak"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ContactTable contacts={contacts} isLoading={isLoading} setIsLoading={setIsLoading} getContacts={getContacts}/>
    </section>
  )
}

export default TambahPenerimaPage