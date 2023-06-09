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
  return (
    <main>
      <div className="table" style={{ gridTemplateColumns: `repeat(${rows[rows.length-1].length}, minmax(min-content, max-content))` }}>
        {
          rows.map((tr, i) => (
            tr.map((td, j) => {
              if(typeof td === "number") return
              else return (
                <div className={typeof tr[0] === "number" ? "td th" : "td"} key={j}>
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
          ))
        }
      </div>
    </main>
  )
}