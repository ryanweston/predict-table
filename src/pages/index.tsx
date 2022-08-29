import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

export interface ITeam {
  id: number
  name: string
  picked: boolean
}

const HomePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  // Team data and hooks
  const [teams, updateTeams] = useState<ITeam[]>([
    { id: 0, name: 'Tottenham Hotspurs', picked: false },
    { id: 1, name: 'Chelsea FC', picked: false },
    { id: 2, name: 'Manchester City', picked: false },
    { id: 3, name: 'Arsenal FC', picked: false },
    { id: 4, name: 'Liverpool FC', picked: false },
    { id: 5, name: 'Brighton Albion FC', picked: false },
    { id: 6, name: 'Leeds United', picked: false },
    { id: 7, name: 'Newcastle', picked: false },
    { id: 8, name: 'Manchester United', picked: false },
    { id: 9, name: 'Brentford', picked: false },
    { id: 10, name: 'Fulham', picked: false },
    { id: 11, name: 'Nottingham Forest', picked: false },
    { id: 12, name: 'Crystal Palace', picked: false },
    { id: 13, name: 'Southampton', picked: false },
    { id: 14, name: 'Aston Villa', picked: false },
    { id: 15, name: 'Bournemouth', picked: false },
    { id: 16, name: 'Everton', picked: false },
    { id: 17, name: 'Leicester City', picked: false },
    { id: 18, name: 'West Ham United', picked: false },
    { id: 19, name: 'Wolverhampton FC', picked: false },
  ])

  const [tablePos, setTablePos] = useState<(number | null)[]>([])
  let zonesMap = new Map()

  // Drag hooks
  const [currentDrag, setCurrentDrag] = useState<number | null>(null)
  const [currentDragOver, setCurrentDragOver] = useState<
    number | 'teamSection' | null
  >(null)

  // Create table array
  useEffect(() => {
    setIsLoading(true)
    const createTable = []
    for (let i = 0; i < teams.length; i++) {
      createTable.push(null)
    }
    setTablePos(createTable)

    // todo: this will come from query when backend is setup
    const highlightedZones = [
      {
        name: 'Promotion',
        startIndex: 0,
        endIndex: 3,
        color: 'bg-green-300',
      },
      {
        name: 'Relegation',
        startIndex: 16,
        endIndex: 19,
        color: 'bg-red-300',
      },
    ]

    highlightedZones.forEach((zone) => {
      for (let i = zone.startIndex; i <= zone.endIndex; i++) {
        zonesMap.set(i, zone.color)
      }
    })
    console.log('um loading should be true', isLoading)
    setIsLoading(false)
    console.log('um loading should be false', isLoading)
  }, [])

  const dragEntered = (e: React.DragEvent, teamId: number) => {
    e.preventDefault()
    setCurrentDrag(teamId)
  }

  const dragEnd = (e: React.DragEvent, teamId: any, currentTeamRow: number) => {
    // Set the table
    const toTable = currentDragOver === 'teamSection' ? false : true
    updateTable(teamId, toTable, currentTeamRow)

    setCurrentDrag(null)
  }

  const dragLeave = (e: React.DragEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    target.classList.remove('bg-blue-200')
  }

  const dragOver = (e: React.DragEvent<HTMLElement>, rowIndex: number) => {
    const target = e.target as HTMLElement
    if (currentDragOver !== rowIndex) setCurrentDragOver(rowIndex)
    target.classList.add('bg-blue-200')
  }

  // Clean up assertions
  const updateTable = (
    teamId: number,
    toTable: boolean,
    currentTeamRow?: number
  ) => {
    const table = [...tablePos]
    const nextTeamRow = (toTable ? currentDragOver : currentDrag) as number

    // If hovered row is occupied with a team, move hovered item to other row
    if (table[nextTeamRow] || table[nextTeamRow] === 0) {
      // Is the currentDrag is not already picked, set dragged over team to not picked
      if (!teams[currentDrag as number]!.picked && table[nextTeamRow]) {
        teams[table[nextTeamRow]!]!.picked = false
        table[nextTeamRow] = null
      } else if (currentTeamRow || currentTeamRow === 0) {
        // move draggedOver team to prev dragged row
        table[currentTeamRow] = table[nextTeamRow]
        table[nextTeamRow] = null
      }
    } else {
      if (currentTeamRow) table[currentTeamRow] = null
    }

    table[nextTeamRow] = toTable ? teamId : null
    setTablePos(table)

    // Adjust what teams have been picked
    const pickedTeams = [...teams]
    pickedTeams[teamId]!.picked = toTable ? true : false
    updateTeams(pickedTeams)
  }

  const dragEndTeam = (e: React.DragEvent, teamIndex: any) => {
    // Set the table
    if (currentDragOver !== null && currentDragOver !== 'teamSection') {
      updateTable(teamIndex, true)
    }

    setCurrentDrag(null)
  }

  const dragOverTeamBox = (e: React.DragEvent) => {
    setCurrentDragOver('teamSection')
  }

  // TODO: save to local storage so it preserves state on refresh

  const onSubmit = () => {
    // check if every position/table row is filled.
    // send to server
    // verify the submission on server
  }

  return (
    <div className="flex flex-col w-screen-1/2 px-20 py-12">
      <h3 className="font-medium text-4xl py-20">Predict-a-tron</h3>
      <div className="grid grid-cols-6 w-full gap-6">
        {/* Table  */}
        <div className="border-separate border-spacing-2 w-full px-12 col-span-4">
          {!isLoading // swap this around
            ? tablePos.map((teamId, rowIndex) => {
                let color = null
                if (zonesMap.has(rowIndex)) color = zonesMap.get(rowIndex)
                console.log('COLOR', zonesMap.get(rowIndex), rowIndex)
                console.log(color)
                return (
                  <div className={clsx('w-full flex flex-row')} key={rowIndex}>
                    <div className="rounded-md py-2 w-1/12 mr-8">
                      <p className="font-medium text-xl text-center bg-transparent">
                        {rowIndex + 1}
                      </p>
                    </div>
                    <div
                      draggable={teamId !== null}
                      onDragOver={(e) => dragOver(e, rowIndex)}
                      onDragLeave={(e) => dragLeave(e)}
                      onDragEnd={(e) =>
                        dragEnd(e, teams[teamId as number]!.id, rowIndex)
                      }
                      onDrag={(e) =>
                        dragEntered(e, teams[teamId as number]!.id)
                      }
                      className={clsx(
                        rowIndex > 0 ? 'border-t-0' : 'rounded-t-lg',
                        rowIndex === 19 ? 'rounded-b-lg' : '', // fix this to tablePos length
                        color ? color : '',
                        'border border-gray-300 py-2 px-4 hover:bg-slate-100 w-full'
                      )}
                    >
                      {teamId ? teams[teamId]?.name : ''}
                    </div>
                  </div>
                )
              })
            : 'loading'}
        </div>

        {/* Teams */}
        <div
          className="min-w-full col-span-2"
          draggable={false}
          onDragOver={(e) => dragOverTeamBox(e)}
        >
          <h5 className="font-medium">Teams</h5>
          <div className="rounded-lg mt-4 w-full">
            {teams.map((item, index) => {
              return !item.picked ? (
                <div
                  className="bg-black text-white py-4 px-4 rounded-lg mt-2"
                  key={item.name}
                  draggable={true}
                  onDrag={(e) => dragEntered(e, index)}
                  onDragEnd={(e) => dragEndTeam(e, index)}
                >
                  {item.name}
                </div>
              ) : (
                <div key={index}></div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-row">
        <button className="ml-4 text-blue-500 border-2 border-blue-500 px-4 py-2 text-white rounded-lg font-medium hover:bg-blue-700">
          Reset
        </button>

        <button className="ml-4 bg-blue-500 px-4 py-2 text-white rounded-lg font-medium hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  )
}

export default HomePage
