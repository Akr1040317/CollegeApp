import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, MapPin, Phone, Calendar, Globe } from 'lucide-react';

export default function PersonalInfoStep({ data, onChange }) {
  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-gray-700 bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-100 mb-2">
          Personal Information
        </CardTitle>
        <p className="text-gray-400 text-lg">
          Let's start with the basics about you
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-base font-semibold text-gray-300">
              First Name
            </Label>
            <Input
              id="firstName"
              value={data.first_name || ''}
              onChange={(e) => onChange('first_name', e.target.value)}
              placeholder="Enter your first name"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-base font-semibold text-gray-300">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={data.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              placeholder="Enter your last name"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-semibold text-gray-300 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-semibold text-gray-300 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-base font-semibold text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.date_of_birth || ''}
              onChange={(e) => onChange('date_of_birth', e.target.value)}
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipcode" className="text-base font-semibold text-gray-300 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Zipcode
          </Label>
          <Input
            id="zipcode"
            value={data.zipcode || ''}
            onChange={(e) => onChange('zipcode', e.target.value)}
            placeholder="12345"
            className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-base font-semibold text-gray-300">
              City
            </Label>
            <Input
              id="city"
              value={data.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="New York"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state" className="text-base font-semibold text-gray-300">
              State
            </Label>
            <Input
              id="state"
              value={data.state || ''}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="NY"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-base font-semibold text-gray-300 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Country
          </Label>
          <Select value={data.country || 'US'} onValueChange={(value) => onChange('country', value)}>
            <SelectTrigger className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}