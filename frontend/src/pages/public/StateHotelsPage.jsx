import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MapPin, Home, Star, Filter, Grid, List, ChevronLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { statesService } from '../../services/api/states'
import { roomsService } from '../../services/api/rooms'
import RoomCard from '../../components/shared/RoomCard'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const StateHotelsPage = () => {
  const { stateId } = useParams()
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    sort: 'price_asc',
    type: '',
  })
  const [viewMode, setViewMode] = useState('grid')

  const { data: state, isLoading: loadingState } = useQuery({
    queryKey: ['state', stateId],
    queryFn: () => statesService.getById(stateId),
    enabled: !!stateId,
  })

  const { data: roomsResponse, isLoading: loadingRooms } = useQuery({
    queryKey: ['state-rooms', stateId, filters],
    queryFn: () => roomsService.getAll({
      state: stateId,
      ...filters,
    }),
    enabled: !!stateId,
  })

  const rooms = roomsResponse?.data || []
  const cities = state?.cities || []

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      sort: 'price_asc',
      type: '',
    })
  }

  if (loadingState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">State Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The state you're looking for doesn't exist.
          </p>
          <Button as={Link} to="/">
            Back to Home
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{state.name} Hotels - StaySynce</title>
        <meta name="description" content={`Find hotels in ${state.name}, India`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={state.image || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80'}
            alt={state.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-7xl mx-auto">
              <Button
                as={Link}
                to="/"
                variant="ghost"
                size="sm"
                className="mb-4 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to States
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{state.name} Hotels</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>India</span>
                </div>
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  <span>{rooms.length} Hotels Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="p-6 sticky top-24">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                  </div>

                  {cities.length > 0 && (
                    <Select
                      label="City"
                      options={[
                        { value: '', label: 'All Cities' },
                        ...cities.map(city => ({
                          value: city._id,
                          label: city.name
                        }))
                      ]}
                      value={filters.city}
                      onChange={(value) => handleFilterChange('city', value)}
                    />
                  )}

                  <Select
                    label="Room Type"
                    options={[
                      { value: '', label: 'All Types' },
                      { value: 'single', label: 'Single' },
                      { value: 'double', label: 'Double' },
                      { value: 'suite', label: 'Suite' },
                      { value: 'deluxe', label: 'Deluxe' },
                      { value: 'presidential', label: 'Presidential' }
                    ]}
                    value={filters.type}
                    onChange={(value) => handleFilterChange('type', value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Min Price"
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <Input
                      label="Max Price"
                      type="number"
                      placeholder="$1000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>

                  <Select
                    label="Sort By"
                    options={[
                      { value: 'price_asc', label: 'Price: Low to High' },
                      { value: 'price_desc', label: 'Price: High to Low' },
                      { value: 'rating_desc', label: 'Highest Rated' },
                      { value: 'name_asc', label: 'Name: A to Z' }
                    ]}
                    value={filters.sort}
                    onChange={(value) => handleFilterChange('sort', value)}
                  />
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Hotels in {state.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {rooms.length} properties found
                  </p>
                </div>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-foreground'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-foreground'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cities Navigation */}
              {cities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Popular Cities in {state.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cities.slice(0, 10).map(city => (
                      <Button
                        key={city._id}
                        variant={filters.city === city._id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('city', city._id)}
                      >
                        {city.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loadingRooms && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              )}

              {/* Rooms Grid/List */}
              {!loadingRooms && (
                <>
                  {rooms.length > 0 ? (
                    <div className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-6'
                    }>
                      {rooms.map(room => (
                        viewMode === 'grid' ? (
                          <RoomCard key={room._id} room={room} />
                        ) : (
                          <RoomListItem key={room._id} room={room} />
                        )
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters or check back later
                      </p>
                      <Button onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </Card>
                  )}
                </>
              )}

              {/* About State */}
              {state.description && (
                <Card className="mt-8 p-6">
                  <h3 className="text-xl font-semibold mb-4">About {state.name}</h3>
                  <p className="text-muted-foreground">{state.description}</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Room List Item Component
const RoomListItem = ({ room }) => (
  <Card hoverable className="flex flex-col md:flex-row">
    <div className="md:w-1/3">
      <img
        src={room.images?.[0]}
        alt={room.name}
        className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
      />
    </div>
    <div className="md:w-2/3 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{room.name}</h3>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{room.city?.name || 'Unknown City'}</span>
          </div>
          <p className="text-muted-foreground mt-2 line-clamp-2">{room.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">${room.pricePerNight}</p>
          <p className="text-sm text-muted-foreground">per night</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <span>⭐ {room.rating || '4.5'}</span>
        <span>👥 {room.capacity} Guests</span>
        <span>📏 {room.size} sqft</span>
        <span className="capitalize">{room.type}</span>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <Button as={Link} to={`/rooms/${room._id}`} variant="outline">
          View Details
        </Button>
        <Button as={Link} to={`/rooms/${room._id}`}>
          Book Now
        </Button>
      </div>
    </div>
  </Card>
)

export default StateHotelsPage