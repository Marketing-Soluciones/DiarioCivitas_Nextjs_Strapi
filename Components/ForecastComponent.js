import dayjs from "dayjs"
import es from "dayjs/locale/es"
import { useEffect, useState } from "react"
import { api } from "../api"

const ForecastComponent = () => {
    const [forecast, setForecast] = useState()
    const FetchData = async (location) => {
        try {
            const {data} = await api.Forecast(location)
            const forecast = data?.forecast[0]
            setForecast(forecast)
        } catch (error) {
            console.log(error)            
        }
    }

    useEffect(() => {
        FetchData("Murcia")
    }, [])
    return (
        <div className="hidden md:block w-max col-span-1 flex flex-col items-center justify-center gap-2">
              <span className="flex gap-2 font-display items-center ">
                  <img src={forecast?.icon_url} className="W-8 h-8" />
                <p className="border-r pr-3">Murcia</p>
                <p className=" font-semibold">{forecast?.avg_temp_c} °C</p>
              </span>
              <p className="font-body text-xs tracking-wider text-gray-700 w-full text-center">{dayjs().locale(es).format("DD MMMM YYYY")}</p>
              
            </div>
    )
}

export default ForecastComponent