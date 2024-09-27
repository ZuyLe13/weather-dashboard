function Forecast(forecasts) {
  const forecastDay = forecasts.forecast.forecast.forecastday

  return (
    <>
      <h2 className="lg:mt-8 sm:mt-4 lg:text-2xl sm:text-xl font-bold tracking-wider">3-Day Forecast</h2>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4 ">
        {
          forecastDay.map((forecast, index) => {
            return (
              <div key={index} className="py-5 px-6 bg-[#6c757d] rounded-md text-slate-100 text-center">
                <span className="text-white font-bold">({forecast.date})</span>
                <img
                  src={forecast.day.condition.icon}
                  alt="icon"
                  className="mx-auto my-2 animate-movingY"
                />
                <p>Temp: {forecast.day.avgtemp_c}°C</p>
                <p className="text-white my-2">Wind: {forecast.day.maxwind_kph} Km/h</p>
                <p>Humidity: {forecast.day.avghumidity}%</p>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default Forecast