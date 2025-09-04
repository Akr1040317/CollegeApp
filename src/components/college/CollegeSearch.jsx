import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, MapPin, Users, DollarSign, TrendingUp, Star } from 'lucide-react';
import { MOCK_COLLEGES, searchColleges, filterColleges, sortColleges, COLLEGE_TYPES, COLLEGE_SIZES } from '@/types/college';

export default function CollegeSearch({ onCollegeSelect, selectedColleges = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    size: 'all',
    region: 'all',
    setting: 'all',
    maxCost: 100000,
    maxAcceptanceRate: 100,
    minSAT: 0,
    minACT: 0
  });
  const [sortBy, setSortBy] = useState('name');
  const [results, setResults] = useState(MOCK_COLLEGES);

  // Memoized filtered and sorted results
  const filteredResults = useMemo(() => {
    let filtered = searchColleges(MOCK_COLLEGES, searchQuery);
    filtered = filterColleges(filtered, filters);
    return sortColleges(filtered, sortBy);
  }, [searchQuery, filters, sortBy]);

  useEffect(() => {
    setResults(filteredResults);
  }, [filteredResults]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      size: 'all',
      region: 'all',
      setting: 'all',
      maxCost: 100000,
      maxAcceptanceRate: 100,
      minSAT: 0,
      minACT: 0
    });
    setSearchQuery('');
  };

  const isCollegeSelected = (collegeId) => {
    return selectedColleges.some(college => college.id === collegeId);
  };

  const formatCost = (cost) => {
    if (!cost) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cost);
  };

  const getCategoryColor = (college) => {
    if (college.user_category === 'reach') return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (college.user_category === 'target') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (college.user_category === 'safety') return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search colleges by name, location, or major..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="acceptance_rate">Acceptance Rate</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="ranking">Ranking</SelectItem>
                <SelectItem value="enrollment">Enrollment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-gray-200">Filters</CardTitle>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Type</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={COLLEGE_TYPES.PUBLIC}>Public</SelectItem>
                    <SelectItem value={COLLEGE_TYPES.PRIVATE}>Private</SelectItem>
                    <SelectItem value={COLLEGE_TYPES.LIBERAL_ARTS}>Liberal Arts</SelectItem>
                    <SelectItem value={COLLEGE_TYPES.RESEARCH}>Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Size</Label>
                <Select value={filters.size} onValueChange={(value) => handleFilterChange('size', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value={COLLEGE_SIZES.SMALL}>Small (&lt; 5,000)</SelectItem>
                    <SelectItem value={COLLEGE_SIZES.MEDIUM}>Medium (5,000-15,000)</SelectItem>
                    <SelectItem value={COLLEGE_SIZES.LARGE}>Large (15,000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Region</Label>
                <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Northeast">Northeast</SelectItem>
                    <SelectItem value="Southeast">Southeast</SelectItem>
                    <SelectItem value="Midwest">Midwest</SelectItem>
                    <SelectItem value="Southwest">Southwest</SelectItem>
                    <SelectItem value="West Coast">West Coast</SelectItem>
                    <SelectItem value="Pacific Northwest">Pacific Northwest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Setting</Label>
                <Select value={filters.setting} onValueChange={(value) => handleFilterChange('setting', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue placeholder="All Settings" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Settings</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="suburban">Suburban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Max Annual Cost: {formatCost(filters.maxCost)}</Label>
                  <Slider
                    value={[filters.maxCost]}
                    onValueChange={([value]) => handleFilterChange('maxCost', value)}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Max Acceptance Rate: {filters.maxAcceptanceRate}%</Label>
                  <Slider
                    value={[filters.maxAcceptanceRate]}
                    onValueChange={([value]) => handleFilterChange('maxAcceptanceRate', value)}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Min SAT Score: {filters.minSAT}</Label>
                  <Slider
                    value={[filters.minSAT]}
                    onValueChange={([value]) => handleFilterChange('minSAT', value)}
                    max={1600}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Min ACT Score: {filters.minACT}</Label>
                  <Slider
                    value={[filters.minACT]}
                    onValueChange={([value]) => handleFilterChange('minACT', value)}
                    max={36}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-200">
            {results.length} College{results.length !== 1 ? 's' : ''} Found
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((college) => (
            <Card
              key={college.id}
              className={`border-gray-600 bg-gray-800/80 hover:bg-gray-700/80 transition-colors cursor-pointer ${
                isCollegeSelected(college.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onCollegeSelect(college)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">{college.name}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {college.city}, {college.state}
                      </p>
                    </div>
                    {college.user_category && (
                      <Badge className={getCategoryColor(college)}>
                        {college.user_category.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{college.enrollment?.toLocaleString() || 'N/A'} students</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>{college.acceptance_rate || 'N/A'}% acceptance</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-400">
                        <DollarSign className="w-3 h-3" />
                        <span>{formatCost(college.tuition_out_state || college.tuition_in_state)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Star className="w-3 h-3" />
                        <span>#{college.us_news_ranking || 'N/A'} ranking</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                        {college.type?.charAt(0).toUpperCase() + college.type?.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                        {college.setting?.charAt(0).toUpperCase() + college.setting?.slice(1)}
                      </Badge>
                      {college.greek_life && (
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                          Greek Life
                        </Badge>
                      )}
                    </div>
                  </div>

                  {college.popular_majors && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Popular Majors:</p>
                      <p className="text-sm text-gray-300">
                        {college.popular_majors.slice(0, 3).join(', ')}
                        {college.popular_majors.length > 3 && '...'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No colleges found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
