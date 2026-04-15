import useEmblaCarousel from 'embla-carousel-react'
import { Container } from '../ui/Container'

const categories = [
  { name: 'Ascenseurs', image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80' },
  { name: 'Escalators', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&q=80' },
  { name: 'Portes auto', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { name: 'Distributeurs', image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&q=80' },
  { name: 'Bornes recharge', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80' },
  { name: 'Horodateurs', image: 'https://images.unsplash.com/photo-1597007030739-6d2e7172ee6c?w=600&q=80' },
  { name: 'Éclairage', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
  { name: 'Interphones', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80' },
  { name: 'Bornes info', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80' },
]

export const CategoriesSection = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  })

  return (
    <section className="py-24 md:py-32 bg-cream">
      <Container>
        <h2 className="font-serif text-4xl md:text-5xl mb-12">
          Catégories d'équipements
        </h2>
      </Container>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex-[0_0_280px] aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover"
              />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-serif text-xl">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}