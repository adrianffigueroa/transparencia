import React from 'react'
import { FaFacebookSquare, FaInstagramSquare, FaYoutube } from 'react-icons/fa'
import { FaSquareXTwitter } from 'react-icons/fa6'

const icons = [
  {
    icon: <FaFacebookSquare />,
    href: '#',
  },
  {
    icon: <FaInstagramSquare />,
    href: '#',
  },
  {
    icon: <FaSquareXTwitter />,
    href: '#',
  },
  {
    icon: <FaYoutube />,
    href: '#',
  },
]

const HomeSocialLogos = () => {
  return (
    <div className="flex justify-center gap-6 my-3">
      {icons.map((icon, index) => (
        <a key={index} href={icon.href} target="_blank" rel="noopener noreferrer">
          <div className="text-black text-2xl">{icon.icon}</div>
        </a>
      ))}
    </div>
  )
}

export default HomeSocialLogos
