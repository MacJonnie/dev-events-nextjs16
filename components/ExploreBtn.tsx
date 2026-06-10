'use client'
import Image from "next/image";
import posthog from "posthog-js";

const ExploreBtn = () => {
  const handleClick = () => {
    console.log("Clicked");
    posthog.capture("explore_events_clicked");
  };

  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleClick}>ExploreBtn
    <a href="#events">
        Explore Events
        <Image src="/icons/arrow-down.svg" alt="Arrow Down" width={24} height={24} className="h-4 w-auto"/>
    </a>
    </button>
  )
}

export default ExploreBtn