import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, Wifi, Coffee, Car, Maximize } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { roomsService } from '../../services/api/rooms'

const RoomCard = ({ room }) => {
  const { data: roomDetails } = useQuery({
    queryKey: ['room', room._id],
    queryFn: () => roomsService.getById(room._id),
    enabled: false
  })

  const amenities = [
    { icon: <Users className="w-4 h-4" />, label: `${room.capacity} Guests` },
    { icon: <Maximize className="w-4 h-4" />, label: `${room.size} sqft` },
    { icon: <Wifi className="w-4 h-4" />, label: 'WiFi' },
    { icon: <Coffee className="w-4 h-4" />, label: 'Breakfast' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card hoverable className="overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800'}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {room.featured && (
            <div className="absolute top-4 left-4">
              <Badge variant="primary">Featured</Badge>
            </div>
          )}
          {!room.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="danger">Unavailable</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{room.name}</h3>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm text-muted-foreground">
                  {room.rating || '4.5'} ({room.reviews || 24} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${room.pricePerNight}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {room.description}
          </p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 text-xs text-muted-foreground"
              >
                {amenity.icon}
                <span>{amenity.label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm">
              <span className="text-foreground font-medium">${room.pricePerNight * 3}</span>
              <span className="text-muted-foreground ml-1">for 3 nights</span>
            </div>
            <Link to={`/rooms/${room._id}`}>
              <Button size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default RoomCard