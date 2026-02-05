'use client'

import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function RecipientsMultiSelect({ 
  value, 
  onChange, 
  contacts, 
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = contacts.filter(contact => {
    const isAlreadySelected = value.some(v => v.id === contact.id)
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phoneNumber.includes(searchQuery)
    return !isAlreadySelected && matchesSearch
  })

  const handleSelectContact = (contact) => {
    const cleanedPhoneNumber = contact.phoneNumber.replace(/\D/g, '')
    .replace(/^0+/, '')
    .replace(/^62/, '')

    const newRecipient = {
      id: contact.id,
      name: contact.name,
      phoneNumber: cleanedPhoneNumber
    }
    onChange([...value, newRecipient])
    setSearchQuery('')
  }

  const handleRemoveRecipient = (id) => {
    onChange(value.filter(v => v.id !== id))
  }

  return (
    <div className="space-y-2">
      {/* Selected Recipients Pills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(recipient => (
            <div
              key={recipient.id}
              className="flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-sm"
            >
              <span className="font-medium">{recipient.name}</span>
              <span className="text-emerald-600">•</span>
              <span className="text-xs text-emerald-700">{recipient.phoneNumber}</span>
              <button
                type="button"
                onClick={() => handleRemoveRecipient(recipient.id)}
                className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors ml-1"
                aria-label={`Hapus ${recipient.name}`}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Search */}
      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-2 border rounded-md px-3 py-2 bg-background cursor-pointer hover:bg-muted/50 transition-colors',
            isOpen && 'ring-2 ring-emerald-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="text"
            placeholder={value.length === 0 ? 'Cari dan pilih penerima...' : 'Tambah penerima lainnya...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => !disabled && setIsOpen(true)}
            className="flex-1 bg-transparent border-0 outline-none placeholder:text-muted-foreground text-sm"
            disabled={disabled}
            aria-label="Search contacts"
          />
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform flex-shrink-0',
              isOpen && 'rotate-180'
            )}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <>
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {contacts.length === 0 
                    ? 'Tidak ada kontak tersedia' 
                    : searchQuery 
                      ? 'Tidak ada hasil pencarian' 
                      : 'Semua kontak sudah dipilih'}
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => {
                      handleSelectContact(contact)
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0 focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.phoneNumber}</div>
                        {contact.notes && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">
                            {contact.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          </>
        )}
      </div>
    </div>
  )
}