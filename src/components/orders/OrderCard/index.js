'use client';
import Link from '@mui/material/Link'
import Image from 'next/image';
import { useState, useContext } from 'react';
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const dayOfMonth = date.getDate().toString().padStart(2, '0');
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${dayOfWeek} ${dayOfMonth}, ${year}, ${hours}:${minutes}`;

  return formattedDate;
};

const Index = ({ order }) => {

    return (
        <div className="flex flex-row w-full py-5 border-b border-slate-400">
            <div className="flex flex-row w-full items-center">
                <Link className="basis-5/12 py-4 text-left" underline="always" href={`/order/${order.id}`} >
                    #{order.id}
                </Link>
                <div className="basis-5/12 py-4 text-center">
                    {formatDate(order.order_date)}
                </div>
                <div className="basis-5/12 py-4 text-center">
                    {order.delivery_mode}
                </div>
                <div className="basis-5/12 py-4 text-center">
                    {order.total_price} €
                </div>
                <div className="basis-5/12 py-4 text-center">
                    <Chip
                    size="small"
                    label={order.status}
                    icon={order.status == 'payed' ? <CheckIcon /> : order.status == 'pending' ? <MoreHorizIcon /> : <UndoIcon />}
                    color={order.status == 'payed' ? "success" : "default"}/>
                </div>
            </div>
        </div>
    );
}

export default Index;
