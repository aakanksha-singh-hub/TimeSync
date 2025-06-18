import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

interface TimeCardProps {
  city: string;
  timeZone: string;
  customDateTime?: DateTime;
}

const TimeCard: React.FC<TimeCardProps> = ({ city, timeZone, customDateTime }) => {
  const [currentTime, setCurrentTime] = useState<DateTime>(DateTime.now().setZone(timeZone));
  const [utcOffset, setUtcOffset] = useState<string>(currentTime.offset / 60 + ' hours');

  useEffect(() => {
    const updateTime = () => {
      const time = customDateTime ? customDateTime.setZone(timeZone) : DateTime.now().setZone(timeZone);
      setCurrentTime(time);
      setUtcOffset(time.offset / 60 + ' hours');
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(intervalId);
  }, [timeZone, customDateTime]);

  return (
    <div className="p-4 border rounded shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold">{city}</h2>
      <p className="text-lg">{currentTime.toLocaleString(DateTime.DATETIME_MED)}</p>
      <p className="text-sm text-gray-500">UTC Offset: {utcOffset}</p>
    </div>
  );
};

export default TimeCard;