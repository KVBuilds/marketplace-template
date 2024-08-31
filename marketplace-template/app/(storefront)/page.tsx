//route grouping

import { CategorySelection } from "../components/storefront/CategorySelection";
import { FeaturedProducts } from "../components/storefront/FeaturedProducts";
import { Hero } from "../components/storefront/Hero";
import { Navbar } from "../components/storefront/Navbar";

export default function IndexPage(){
    return (
        <div>
            <Hero />
            <CategorySelection />
            <FeaturedProducts />
        </div>
    )
}