import { useEffect, useState } from "react"
import Forecast from "./components/Forecast"
import Subscription from "./components/Subscription"

const baseApi = 'http://localhost:3000/api'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [city, setCity] = useState('')
  const [citySearch, setCitySearch] = useState('Ho Chi Minh')

  // State histories để quản lý những city đã tìm kiếm
  const [histories, setHistory] = useState(() => {
    const storedHistories = JSON.parse(localStorage.getItem('histories'))
    const storedDate = localStorage.getItem('historyDate')
    const currentDate = new Date().toLocaleDateString()

    /*
    Ngày lưu trong localstorage khác ngày hiện tại thì sẽ xóa lịch sử 
    city đã tìm và ngày lưu khỏi localstorage
    */
    if (storedDate !== currentDate) {
      localStorage.removeItem('histories')
      localStorage.removeItem('historyDate')

      return []
    }

    return storedHistories || []
  })

  // Hàm lấy dữ liệu thời tiết
  const fetchWeatherData = async (city) => {
    const url = `${baseApi}/forecast?city=${city}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch data mỗi khi citySearch thay đổi
  useEffect(() => {
    if (citySearch) {
      fetchWeatherData(citySearch)
    }
  }, [citySearch])

  // Hàm xử lý tìm kiếm và lưu city đã tìm vào localstorage có thể hiển thị lại trong ngày
  const handleSearch = () => {
    if (!city.trim()) {
      alert('Please enter a city name')
      return
    }

    setCitySearch(city)
    setHistory((prevHistories) => {
      if (prevHistories.includes(city)) {
        return prevHistories
      }

      const updatedHistories = [...prevHistories, city]
      const currentDate = new Date().toLocaleDateString()

      // Thực hiện cập nhật lịch sử tìm kiếm và ngày lưu vào localstorage 
      localStorage.setItem('histories', JSON.stringify(updatedHistories))
      localStorage.setItem('historyDate', currentDate)

      return updatedHistories
    })
  }

  // Hàm set vị trí hiện tại
  const handleCurrentLocation = () => {
    setCitySearch('Ho Chi Minh')
    setCity('Ho Chi Minh')
  }

  // Hàm set city đã lưu ở localstorage
  const handleHistoryLocation = (history) => {
    setCitySearch(history)
    setCity(history)
  }

  return (
    // <>
    //   <WeatherDashboard />
    // </>

    <>
      {/* Header */}
      <header className="bg-[#5372f0] text-3xl text-white font-bold text-center p-5 tracking-wide">
        Weather Dashboard
      </header>

      <div className="container pb-5 flex lg:flex-row sm:flex-col xl-gap-12 sm:gap-8 mt-8 overflow-hidden">
        {/* Search */}
        <div className="flex flex-col xl:w-[25%] lg:w-[32%] lg:p-0 md:px-20 sm:px-6">
          <h3 className="text-xl">Enter a City Name</h3>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            placeholder="E.g., New York, London, Tokyo"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-[4px]"
          />

          {/* Button Search */}
          <button
            onClick={handleSearch}
            className="w-full py-2 mt-5 bg-[#5372f0] text-white rounded-[4px] hover:bg-[#3f60e3]  hover:shadow-lg duration-300">
            Search
          </button>

          <div className="flex items-center gap-3 mt-4">
            <span className="flex-1 h-[1px] bg-slate-300"></span>
            <p className="text-slate-500">or</p>
            <span className="flex-1 h-[1px] bg-slate-300"></span>
          </div>

          {/* Button Current Location */}
          <button
            onClick={handleCurrentLocation}
            className="w-full py-2 mt-4 bg-[#6c757d] hover:bg-[#5a6168] hover:shadow-lg text-white rounded-[4px] duration-300">
            Use Current Location
          </button>

          {/* Location history */}
          <div className="flex items-center gap-3 mt-4">
            <span className="flex-1 h-[1px] bg-slate-300"></span>
            <p className="text-slate-500">Location history</p>
            <span className="flex-1 h-[1px] bg-slate-300"></span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {
              histories.map((history, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => handleHistoryLocation(history)}
                    className="w-full py-2 bg-[#5372f0] text-white rounded-[4px] hover:bg-[#3f60e3] hover:shadow-lg duration-300">
                    {history}
                  </button>
                )
              })
            }
          </div>

        </div>

        {/* Show Current Weather */}
        {weatherData && (
          <div className="flex-1 overflow-hidden">
            <div className="flex md:flex-row sm:flex-col items-center md:justify-between sm:gap-4 px-8 py-5 bg-[#5372f0] rounded-md md:text-start sm:text-center">
              <div>
                <h2 className="lg:text-2xl sm:text-xl text-white pb-3 font-bold tracking-wider">{weatherData.location.name} ({weatherData.current.last_updated})</h2>
                <div className="text-slate-100 lg:text-base sm:text-sm">
                  <p>Temperature: {weatherData.current.temp_c}°C</p>
                  <p className="my-2">Wind: {weatherData.current.wind_kph} Km/h</p>
                  <p>Humidity: {weatherData.current.humidity}%</p>
                </div>
              </div>

              <div className="flex flex-col items-center xl:mr-16">
                <img
                  src={weatherData.current.condition.icon}
                  alt="Weather Icon"
                  className="h-24 object-cover animate-movingY"
                />
                <p className="text-center text-slate-100 mt-1">{weatherData.current.condition.text}</p>
              </div>
            </div>

            {/* 3-Day Forecast */}
            <Forecast forecast={weatherData} />

          </div>
        )}
      </div>

      {/* Subscription */}
      <div className="container pb-16 mt-6">
        <Subscription />
      </div>

    </>
  )
}

export default App
