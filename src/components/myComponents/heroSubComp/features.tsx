import { Card, CardContent } from "@/components/ui/card";
import { featType, features } from "@/data/features";


export default function Features(){
  return(
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 ">
            Powerful Features for Your Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature:featType, index) => (
              <Card
                key={index}
                className="border-2  card-hover rounded-[8px]   transition-colors duration-300 cursor-pointer"
              >
                <CardContent className="pt-6 text-center flex flex-col items-center ">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}