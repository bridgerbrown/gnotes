import React, { useEffect, useState } from 'react'
import Navbar from '@/components/modules/navbar'
import Footer from '@/components/modules/footer'
import NotePreview from '@/components/modules/notes/NotePreview'
import Image from 'next/image';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { compareAsc, compareDesc, parseISO } from 'date-fns';

export default function Notes({userCtxt}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const inactiveSortItemCSS: string = `opacity-50 hover:opacity-100 flex cursor-pointer`;
  const activeSortItemCSS: string = `opacity-100 flex cursor-pointer`;
  const arrowDescendingCss: string = `cursor-pointer ml-1.5 mr-4 mt-0.5 w-3 opacity-70 h-fit`;
  const arrowAscendingCss: string = `rotate-180 cursor-pointer ml-1.5 mr-4 mt-0.5 w-3 opacity-70 h-fit`;
  const [userId, setUserId] = useState<string>("");
  const [usersNotes, setUsersNotes] = useState<any>([]);
  const [sortedType, setSortedType] = useState<string>("date");
  const [dateAscending, setDateAscending] = useState<boolean>(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState<boolean>(false);
  const usersEmail = userCtxt.email;

  async function getUserDocument(email: any){
    await fetch("http://localhost:3000/api/users")
      .then(response => response.json())
      .then(data => {
        const arr = []
        for(var i in data){
          arr.push(data[i]);
        }
        const user = arr[1].filter((item: any) => item.email === email)
        setUserId(user[0].userId)
        getUserNotes(user[0].userId)
    })
  }

  console.log(usersNotes)

  async function getUserNotes(userId: string){
    await fetch(`/api/notes?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
        setUsersNotes(data.data)
        })
      .catch(error => {
        console.log(error)
      })
  }
  
  const sortByDate = () => {
    sortedType == "date" ?
      setDateAscending(!dateAscending)
      :
      setSortedType("date");
    console.log(dateAscending)
  };

  const sortedNotesAscDates = [...usersNotes].sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
  const sortedNotesDescDates = [...usersNotes].sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));

  useEffect(() => {
    getUserDocument(usersEmail)
    console.log(sortedNotesAscDates);
    console.log(sortedNotesDescDates);
  }, [])

  useEffect(() => {
    if(deleteConfirmed){
      getUserNotes(userId)
      setDeleteConfirmed(false);
    }

  }, [deleteConfirmed])
 

  return (
    <main className="font-SansPro bg-pageBg min-h-screen w-screen relative">
      <Navbar />
      <div className='mx-8 flex flex-col justify-center items-center'>
        <div className='min-h-[85vh] border-boxBorder border drop-shadow-lg rounded-lg bg-boxBg pb-20 w-full'>
          <header className='border-b border-headerBorder flex justify-between items-center pt-5 pb-4 px-8'>
            <h2 className='text-2xl font-regular text-blackHeading'>
              Notes
            </h2>
          </header>
          <div className='flex justify-between items-center mx-8 mt-4 mb-4'>
            <div className='flex'>
              <h3 className='mr-4 text-sm text-blackHeading font-light'>
                Sort by:
              </h3>
              <div className={sortedType == "date" ? activeSortItemCSS : inactiveSortItemCSS}
                onClick={() => {
                  sortedType == "date" ?
                    setDateAscending(!dateAscending)
                    :
                    setSortedType("date");
                }}
              >
                <h3 className="cursor-pointer text-sm text-blackHeading font-light">
                  Date
                </h3>
                <Image
                  src={"/arrow-down.png"}
                  alt="Date sorting ascending or descending arrow"
                  width={384}
                  height={448}
                  className={dateAscending ? arrowAscendingCss : arrowDescendingCss}
                />
              </div>
              <div 
                className={sortedType == "last-updated" ? activeSortItemCSS : inactiveSortItemCSS}
                onClick={() => setSortedType("last-updated")}
              >
                <h3 className="cursor-pointer text-sm text-blackHeading font-light">
                  Last Updated 
                </h3>
              </div>
            </div>
            <input 
              type='search'
              className='pl-10 pr-4 font-light border-grayHeading border rounded-full h-10 w-72'
            />
            <Image
              src={"/search.png"}
              alt="search icon, magnifying glass"
              width={512}
              height={512}
              className='w-4 fixed right-72 opacity-60'
            />
          </div>
          <div className='mx-8 my-10 flex flex-wrap'>
           {
            usersNotes ?
              sortedType == "date" ?
                  dateAscending ?
                    sortedNotesAscDates.map((note: any) => <NotePreview key={note._id} note={note} setDeleteConfirmed={setDeleteConfirmed} />)
                    :
                    sortedNotesDescDates.map((note: any) => <NotePreview key={note._id} note={note} setDeleteConfirmed={setDeleteConfirmed} />)
                  :
                  null
              :
              <div className='w-full flex justify-center items-center my-12'>
                <h2 className='text-2xl font-thin text-blackHeading animate-pulse'>
                    Loading...
                </h2>
              </div>
            } 
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx){
    const session = await getSession(ctx.req, ctx.res);
    return {
      props: {
        userCtxt: JSON.parse(JSON.stringify(session)).user
      }
    }
  }
})
