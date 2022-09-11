
import uuid from 'react-uuid';
import { useEffect, useState } from 'react';

export default function App() {

   const m = 15
   const n = 6

   const [users, setUsers] = useState()
   const [devs, setDevs] = useState()
   const [starter, setStarter] = useState(0)
   const [mat, setMat] = useState()
   const [name, setName] = useState('')
   const [matchedRow, setMatchedRow] = useState('')
   const [selectedObj, setSelectedObj] = useState()
   const [rights, setRights] = useState()
   const [permit, setPermit] = useState(0)
   const [polzovatel, setPolzovatel] = useState('')


   const makeUsers = () => {
      const tmp = []
      for (let i = 0; i < m; i++) tmp.push(String.fromCharCode(97 + i))
      setUsers(tmp)
   }

   const makeDevs = () => {
      const tmp = []
      for (let i = 0; i < n; i++) tmp.push('obj' + i)
      setDevs(tmp)
   }

   useEffect(() => {
      makeUsers()
      makeDevs()
   }, [m, n])

   function generateRND(min, max) {
      let rnd = ''
      for (let k = 0; k < 3; k++) {
         rnd += Math.floor(Math.random() * (max - min + 1)) + min;
      }
      return rnd
   }

   function generateMatrix() {
      const matrix = []
      for (let i = 0; i < m; i++) {
         let tmp = []
         for (let j = 0; j < n; j++) {
            tmp.push(generateRND(0, 1))
         }
         matrix.push(tmp)
      }
      setMat(matrix)
   }

   useEffect(() => {
      generateMatrix()
   }, [starter])

   const checkAdmin = () => {
      let res = 0
      for (let row of mat) {
         let k = 0
         for (let x of row) {
            if (Number(x) === 111) k++
         }
         if (k === row.length) res = 1
      }
      if (res === 0)
         setMat(mat.map((row, i) => i === 0 ? row.map(item => item = '111') : row))
   }

   const findUser = () => {
      if (users.indexOf(name) != -1) {
         setMatchedRow(mat[users.indexOf(name)])
         alert('found')
      }
      else alert('not found')
   }

   const getRights = () => {
      setRights(matchedRow[devs.indexOf(selectedObj)])
      console.log(rights)
   }

   useEffect(() => {
      if (selectedObj) getRights()
   }, [selectedObj])

   const giveRights = () => {
      let i_row = users.indexOf(polzovatel)
      let i_item = devs.indexOf(selectedObj)
      setMat(mat.map((r, ind) => ind === i_row ? r.map((el, i) => i === i_item ? el = el.slice(0, 2) + '1' : el) : r))
   }
   return (
      <div>

         <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {
               mat && <div>
                  <center><button style={{ marginBottom: '5px' }} onClick={() => starter === 0 ? setStarter(1) : setStarter(0)}>generate matrix</button> </center>
                  <table border={'1px solid black'}>
                     <thead>
                        <tr>
                           <th></th>
                           {
                              devs.map(dev => <th key={uuid()}>{dev}</th>)
                           }
                        </tr>
                     </thead>
                     <tbody>
                        {
                           mat.map((row, index) => <tr key={uuid()}>
                              <td>{users[index]}</td>{row.map(item => <td key={uuid()}>{item}</td>)}
                           </tr>
                           )
                        }
                     </tbody>
                  </table>
                  <center><button style={{ marginTop: '5px' }} onClick={() => checkAdmin()}>check for admin existence</button> </center>
               </div>
            }

            <div>
               <input
                  placeholder='введите имя'
                  onChange={e => setName(e.target.value)}
               />
               <button onClick={() => findUser()}>search user</button>
               {
                  matchedRow && (
                     <div>
                        <p>текущий пользователь:{name}</p>
                        <ul>
                           {
                              matchedRow.map((item, index) => <li key={uuid()}>{devs[index]}: {item}</li>)
                           }
                        </ul>
                        <div>
                           <select value={selectedObj} defaultValue={"доступные объекты"} onChange={e => setSelectedObj(e.target.value)}>
                              <option onClick={() => getRights()} value={"доступные объекты"} disabled>
                                 доступные объекты
                              </option>
                              {
                                 devs.filter((item, index) => matchedRow[index] !== '000').map(r => <option value={r} key={uuid()}>{r}</option>)
                              }
                           </select>
                           {
                              rights && <div>
                                 <ul>
                                    {
                                       rights.split('').map(s => <li key={uuid()}>{s}</li>)
                                    }
                                 </ul>
                                 {
                                    rights[rights.length - 1] == 1 && <>
                                       <button onClick={() => permit === 0 ? setPermit(1) : setPermit(0)}>передать права</button>
                                       {
                                          permit !== 0 && <div>
                                             <input onChange={e => setPolzovatel(e.target.value)} placeholder='укажите пользователя' />
                                             {
                                                polzovatel != '' && users.indexOf(polzovatel) !== -1 && <button onClick={() => giveRights()}>подтвердить</button>
                                             }
                                          </div>
                                       }
                                    </>
                                 }
                              </div>
                           }
                        </div>
                     </div>
                  )

               }
            </div>

         </div>
      </div>

   )
}