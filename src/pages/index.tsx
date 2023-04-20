import { VirtualScroll } from "@/components/virtual-list";

interface Items {
  name: string;
  desc: string;
}

export default function Home() {
  const items: Items[] = Array(100000).fill({
    name: "hello",
    desc: "desc hello"
  });
  return (
    <VirtualScroll
      itemHeight={50} 
      items={items} 
      windowHeight={450} 
      windowWidth={250}
      buffer={3}
      renderItems={function (props: Items, index) {
        return <div>
          {`${props.name} ${props.desc} ${index}`}
        </div>
      }} 
    />
  )
}
