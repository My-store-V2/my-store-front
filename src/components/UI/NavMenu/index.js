import * as React from 'react';
import Link from "next/link";

const Index = ({menu, color}) => {

  const colors = {
    scale: "scale-500",
    black: "black",
    grey: "gray-900",
    white: "white"
  }



  return (
    <nav className='flex flex-row items-center'>
      <ul className="flex px-6 items-center justify-between lg:gap-x-12">
        {
          menu.map((item, index) => (
            <li key={index} className="lg:flex-1">
              <Link 
                href={item.path} 
                className={`text-md font-normal leading-6 text-${colors[color]} text-base hover:text-slate-500`}>
                {item.name}
              </Link>
            </li>
          ))
        }
      </ul>
    </nav>
  );
}

export default Index;
