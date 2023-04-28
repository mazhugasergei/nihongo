// react
import { useEffect } from "react"
// fetch from file
import path from "path"
import fs from "fs"



interface context {
  params: {
    id: string
  }
}



interface data {
  rows: [
    [
      number | [ string | string [] ]
    ]
  ]
}



export const getServerSideProps = async (context: context) => {
  const { id } = context.params

  const filePath = path.join(process.cwd(), `src/api/vocab/${id}.json`)
  const fileContents = fs.readFileSync(filePath, "utf8")
  const data = JSON.parse(fileContents)

  return {
    props: data
  }
}



export default ({ rows }: data) => {
  useEffect(()=>{
    document.querySelectorAll(".table").forEach(table => {
      const itemsInRow = table.querySelector(".tr")?.childElementCount
      if(itemsInRow){
        // for each column
        for(let col=0; col<itemsInRow-1; col++){
          let maxWidth = 0
          // for each row
          table.querySelectorAll(".tr").forEach(row => {
            const tdWidth = row.querySelectorAll<HTMLElement>(".td")[col].offsetWidth
            // get max width
            if(tdWidth > maxWidth) maxWidth = tdWidth
          })
          table.querySelectorAll(".tr").forEach(row => {
            row.querySelectorAll<HTMLElement>(".td")[col].style.width = `${maxWidth+1}px`
          })
        }
      }
    })
  }, [])
  

  return (
    <main>
      <div className="table">
        {
          rows.map((tr, i) => (
            <div className={ typeof tr[0] === "number" ? "tr th" : "tr" } key={i}>
              {
                tr.map((td, j) => {
                  if(typeof td === "number") return
                  else return (
                    <div className="td" key={j}>
                      {
                        td.map((item, k) => {
                          switch(typeof item){
                            case "string":
                              if(item === "\n") return ( <br key={k} /> )
                              else return item
                            case "object": return ( <div className="furigana" key={k}>{ item[0] }<span>{ item[1] }</span></div> )
                          }
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </div>
    </main>
  )
}