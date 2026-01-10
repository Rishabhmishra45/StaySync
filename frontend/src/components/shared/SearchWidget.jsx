import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Users, MapPin, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const searchSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.string().min(1, 'Number of guests is required'),
  roomType: z.string().optional()
})

const SearchWidget = () => {
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(false)

  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: '',
      checkIn: '',
      checkOut: '',
      guests: '1',
      roomType: ''
    }
  })

  const onSubmit = (data) => {
    setIsSearching(true)
    const queryParams = new URLSearchParams(data).toString()
    navigate(`/rooms?${queryParams}`)
  }

  const roomTypes = [
    { value: '', label: 'All Room Types' },
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'presidential', label: 'Presidential Suite' }
  ]

  const guestOptions = [
    { value: '1', label: '1 Guest' },
    { value: '2', label: '2 Guests' },
    { value: '3', label: '3 Guests' },
    { value: '4', label: '4 Guests' },
    { value: '5+', label: '5+ Guests' }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div className="lg:col-span-2">
          <Input
            label="Location"
            placeholder="Where are you going?"
            icon={<MapPin className="w-5 h-5" />}
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        {/* Check-in */}
        <div>
          <Input
            label="Check-in"
            type="date"
            icon={<Calendar className="w-5 h-5" />}
            error={errors.checkIn?.message}
            {...register('checkIn')}
          />
        </div>

        {/* Check-out */}
        <div>
          <Input
            label="Check-out"
            type="date"
            icon={<Calendar className="w-5 h-5" />}
            error={errors.checkOut?.message}
            {...register('checkOut')}
          />
        </div>

        {/* Guests */}
        <div>
          <Select
            label="Guests"
            options={guestOptions}
            control={control}
            name="guests"
            error={errors.guests?.message}
          />
        </div>

        {/* Room Type */}
        <div>
          <Select
            label="Room Type"
            options={roomTypes}
            control={control}
            name="roomType"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          loading={isSearching}
          className="px-8"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Rooms
        </Button>
      </div>
    </form>
  )
}

export default SearchWidget