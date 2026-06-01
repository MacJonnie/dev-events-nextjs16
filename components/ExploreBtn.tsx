'use client'
import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log("Clicked")}>ExploreBtn
    <a href="#events">
        Explore Events
        <Image src="/icons/arrow-down.svg" alt="Arrow Down" width={24} height={24} className="h-4 w-auto"/>
    </a>
    </button>
  )
}

export default ExploreBtn