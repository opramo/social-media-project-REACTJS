import food1 from "../Assets/food1.jpg";
import kiss from "../Assets/kiss.png";
import cat from "../Assets/cat.jpg";
import {
  PaperAirplaneIcon,
  ChevronLeftIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalNewComment from "./ModalNewComment";
import { Popover } from "@headlessui/react";
import { motion } from "framer-motion";

const Recipe = () => {
  const navigate = useNavigate();
  const [modalNewComment, setModalNewComment] = useState(false);
  const [kissed, setKissed] = useState(false);
  const modalNewCommentHandler = () => {
    setModalNewComment(!modalNewComment);
  };

  const [isPage, setIsPage] = useState({
    main: 1,
    recipe: 0,
    kisses: 0,
    comment: 0,
  });

  useEffect(() => {
    printKissed();
  }, [kissed]);

  const printKissed = () => {
    return (
      <button
        className={`h-14 w-14 rounded-full border-2 border-merah mr-1 overflow-hidden duration-500 hover:shadow-black shadow-md focus:outline-none ${
          kissed ? "bg-merah" : "grayscale"
        }`}
        onClick={() => {
          setKissed(!kissed);
        }}
      >
        <img src={kiss} alt="" className="scale-90" />
      </button>
    );
  };

  return (
    <div className="relative w-full min-h-[600px] mb-5 rounded bg-transparent shadow-black shadow-xl">
      <ModalNewComment
        modalNewComment={modalNewComment}
        modalNewCommentHandler={modalNewCommentHandler}
      />
      {/* Nav Content */}
      <div className="absolute w-[6%] left-[94%] flex flex-col h-full z-10 bg-black/40 rounded-r">
        <button
          type="button"
          className={`w-full h-[10%]  rounded-r focus:outline-none duration-500 ${
            isPage.main ? "bg-merah" : "bg-putih"
          }`}
          onClick={() => {
            return setIsPage({ main: 1, recipe: 0, kisses: 0, comment: 0 });
          }}
        >
          <ChevronLeftIcon
            className={`${
              isPage.main
                ? "w-full h-full text-putih duration-500"
                : "w-full h-full duration-500"
            }`}
          />
        </button>
        <button
          type="button"
          className={`w-full h-[30%] rounded-r break-words px-2 focus:outline-none  duration-500 ${
            isPage.recipe ? " bg-merah text-putih " : " bg-putih "
          }`}
          onClick={() => {
            return setIsPage({ main: 0, recipe: 1, kisses: 0, comment: 0 });
          }}
        >
          REC I PE
        </button>
        <button
          type="button"
          className={`w-full h-[30%] rounded-r break-words px-2 focus:outline-none duration-500 ${
            isPage.kisses ? "bg-merah text-putih" : " bg-putih "
          }`}
          onClick={() => {
            return setIsPage({ main: 0, recipe: 0, kisses: 1, comment: 0 });
          }}
        >
          K I<br /> S SES
        </button>
        <button
          type="button"
          className={`w-full h-[30%] rounded-r break-words px-2 focus:outline-none duration-500 ${
            isPage.comment ? "bg-merah text-putih" : "bg-putih"
          }`}
          onClick={() => {
            return setIsPage({ main: 0, recipe: 0, kisses: 0, comment: 1 });
          }}
        >
          COMMENT
        </button>
      </div>
      {/* Front Page */}
      {isPage.main === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5  bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full py-5 bg-putih">
              <div className="h-[10%] w-full flex justify-between px-5 text-sm">
                <div
                  className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                  onClick={() => navigate("/account")}
                >
                  <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                    <img src={cat} alt="" />
                  </div>
                  <div>
                    <div className="mb-1">CatTheChef</div>
                    <div>Gordon Ramspaw</div>
                  </div>
                </div>
                <div className="flex flex-col text-center items-end mb-1">
                  <DotsHorizontalIcon
                    className="h-5 w-5 cursor-pointer hover:text-merah 
                    text-merah/50 duration-500 border-2 border-merah/30 rounded-full hover:bg-merah/30 hover:border-transparent"
                    onClick={() => {}}
                  />
                  <div className="text-xs">28th June 2022</div>
                </div>
              </div>
              <div className="h-[80%] w-full relative">
                <div className="w-20 h-6 origin-center rotate-[-45deg] absolute top-4 bg-white/50"></div>
                <div className="w-20 h-6 origin-center rotate-[-45deg] absolute bottom-10 right-0 bg-white/50"></div>
                <div className="h-full w-full p-5 -mt-3">
                  <div className="h-5/6 p-2 pb-0 bg-white">
                    <img
                      src={food1}
                      alt=""
                      className="w-full h-full object-cover"
                      // style={{ objectPosition: "0 0" }}
                    />
                  </div>
                  <div className="h-1/6 flex items-center justify-center text-center text-2xl bg-white">
                    "Spawgetti Seafood Marinara"
                  </div>
                </div>
              </div>
              <div className="h-[10%] w-full flex justify-around item px-5 -mt-3">
                <>{printKissed()}</>
                <button className="h-14 w-14 rounded-full  border-2 border-biru ml-1 overflow-hidden  hover:bg-biru duration-500 hover:shadow-black shadow-md focus:outline-none">
                  <PaperAirplaneIcon className="h-full w-full p-2 hover:text-white " />
                </button>
                <Popover as="div" className="relative h-14 w-14">
                  {({ open, close }) => (
                    <>
                      <Popover.Button className="absolute h-14 w-14 rounded-full  border-2 border-biru overflow-hidden  hover:bg-biru duration-500 hover:shadow-black shadow-md focus:outline-none">
                        Solutions
                      </Popover.Button>
                      {/*const container =
                       hidden: { opacity: 1, scale: 0 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            delayChildren: 0.3,
                            staggerChildren: 0.2
                          }
                        }
                      }

                      const item = {
                        hidden: { y: 20, opacity: 0 },
                        visible: {
                          y: 0,
                          opacity: 1
                        } */}
                      {open && (
                        <Popover.Panel
                          static
                          as={motion.div}
                          className="relative border-2 border-merah w-36 h-32 -translate-y-16 -translate-x-[32%] pointer-events-none"
                          transition={{
                            hidden: { opacity: 1, scale: 0 },
                            visible: {
                              opacity: 1,
                              scale: 1,
                              transition: {
                                delayChildren: 0.3,
                                staggerChildren: 0.2,
                              },
                            },
                          }}
                        >
                          <motion.button
                            hidden={{ opacity: 0 }}
                            visible={{ opacity: 1 }}
                            className="bg-kuning z-50 h-14 w-14 rounded-full overflow-hidden  duration-500 hover:shadow-black shadow-md focus:outline-none pointer-events-auto"
                            onClick={() => {
                              close();
                            }}
                          >
                            Edit
                          </motion.button>

                          <button
                            as="button"
                            className="absolute top-0 right-0 bg-merah z-10 h-14 w-14 rounded-full overflow-hidden  duration-500 hover:shadow-black shadow-md focus:outline-none pointer-events-auto"
                            onClick={() => {
                              close();
                            }}
                          >
                            Delete
                          </button>
                        </Popover.Panel>
                      )}
                    </>
                  )}
                </Popover>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Recipe Page */}
      {isPage.recipe === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5  bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full p-5 bg-putih">
              <div className="w-full h-[250px] bg-putih h mb-7">
                Ingredients:
                <div className="w-full h-full overflow-y-scroll border-y border-merah">
                  <ul className="max-w-full list-disc ml-5 break-words text-sm bg-putih">
                    <li>
                      6 oz / 180g dried spaghetti pasta (or other long pasta of
                      choice)
                    </li>
                    <li>2 1/2 tbsp olive oil , separated</li>
                    <li>
                      10 oz / 300g seafood Marinara mix , or make your own (Note
                      1)
                    </li>
                    <li>2 garlic cloves , minced</li>
                    <li>1/2 onion , finely chopped (~1/2 cup)</li>
                    <li>1/2 cup white wine (any) (Note 2)</li>
                    <li>
                      2 cups tomato passata/tomato puree (Note 3) OR 600g/20oz
                      canned crushed tomato + 1/2 cup water
                    </li>
                    <li>1/2 tsp sugar</li>
                    <li>2 tbsp finely chopped fresh parsley</li>
                  </ul>
                </div>
              </div>
              <div className="w-full h-[250px] bg-putih">
                Instructions:
                <div className="w-full h-full overflow-y-scroll border-y border-merah">
                  <ol className="max-w-full list-decimal ml-5 break-words text-sm bg-putih">
                    <li>
                      Bring a large pot of salted water to boil. Cook pasta
                      according to packet directions, but reduce the cooking
                      time by 1 minute (because the pasta will finish cooking in
                      the sauce). RESERVE 1 mug of pasta water, then drain the
                      pasta.
                    </li>
                    <li>
                      Separate the seafood mix based on cook time. Longest cook
                      time: fish and medium / large prawns, medium cook time:
                      small prawns, shortest cook time: calamari.
                    </li>
                    <li>
                      Heat 1 1/2 tbsp oil in a large skillet over high heat. Add
                      fish and large prawns first, cook for 30 seconds. Add
                      small prawns, cook for 30 seconds. Add calamari, cook for
                      1 minute. Immediately transfer everything to a bowl.
                    </li>
                    <li>
                      Reduce heat to medium high. Heat remaining 1 tbsp oil,
                      then add garlic and onion. Cook for 3 minutes until onion
                      is translucent.
                    </li>
                    <li>
                      Add wine and bring to simmer, scraping the bottom of the
                      skillet to mix the brown bits into the liquid. Simmer for
                      1 minute or until alcohol smell has evaporated.
                    </li>
                    <li>
                      Add tomato passata, sugar, salt & pepper. Low heat to
                      medium high, bring to simmer and cook for 2 minutes.
                    </li>
                    <li>
                      Adjust salt and pepper to taste. Add pasta, seafood,
                      around 1/2 cup of reserved pasta cooking water into the
                      sauce. Toss gently and cook for 1 to 2 minutes or until
                    </li>
                    <li>
                      the sauce has thickened and coats the pasta. Serve,
                      garnished with fresh parsley. (See Note 4 re: parmesan
                      cheese)
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Kisses Page */}
      {isPage.kisses === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5 flex bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full p-5 bg-putih">
              <div className="w-full relative bg-putih text-3xl">
                9 Chefs loved this recipe:
              </div>
              <div className="h-full w-full relative bg-putih border-y border-merah  overflow-y-scroll mt-5">
                <ul className="max-w-full ml-5 break-words text-xl bg-putih">
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                        <img src={cat} alt="" />
                      </div>
                      <div>
                        <div className="mb-1">CatTheChef</div>
                        <div>Gordon Ramspaw</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      {isPage.comment === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5 flex bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full p-5 bg-putih">
              <div className="w-full relative bg-putih text-3xl">
                Comments from other chefs:
              </div>
              <div className="h-full w-full relative bg-putih overflow-y-scroll border-y border-merah mt-5">
                <ul className="max-w-full ml-5 break-words text-base bg-putih">
                  <li className="flex flex-col">
                    <div className="h-[10%] w-full flex justify-between">
                      <div
                        className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                        onClick={() => navigate("/account")}
                      >
                        <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                          <img src={cat} alt="" />
                        </div>
                        <div>
                          <div className="mb-1">CatTheChef</div>
                          <div>Gordon Ramspaw</div>
                        </div>
                      </div>
                      <div className="flex text-center items-end mb-1">
                        28th June 2022
                      </div>
                    </div>
                    <div className="ml-16">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Tempora corrupti praesentium, esse error suscipit,
                      reprehenderit eos molestiae facere quod distinctio illo,
                      minima aut quisquam? Animi quae necessitatibus corporis
                      voluptate ut.
                    </div>
                  </li>
                  <li className="flex flex-col">
                    <div className="h-[10%] w-full flex justify-between">
                      <div
                        className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                        onClick={() => navigate("/account")}
                      >
                        <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                          <img src={cat} alt="" />
                        </div>
                        <div>
                          <div className="mb-1">CatTheChef</div>
                          <div>Gordon Ramspaw</div>
                        </div>
                      </div>
                      <div className="flex text-center items-end mb-1">
                        28th June 2022
                      </div>
                    </div>
                    <div className="ml-16">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Tempora corrupti praesentium, esse error suscipit,
                      reprehenderit eos molestiae facere quod distinctio illo,
                      minima aut quisquam? Animi quae necessitatibus corporis
                      voluptate ut.
                    </div>
                  </li>
                  <li className="flex flex-col">
                    <div className="h-[10%] w-full flex justify-between">
                      <div
                        className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                        onClick={() => navigate("/account")}
                      >
                        <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                          <img src={cat} alt="" />
                        </div>
                        <div>
                          <div className="mb-1">CatTheChef</div>
                          <div>Gordon Ramspaw</div>
                        </div>
                      </div>
                      <div className="flex text-center items-end mb-1">
                        28th June 2022
                      </div>
                    </div>
                    <div className="ml-16">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Tempora corrupti praesentium, esse error suscipit,
                      reprehenderit eos molestiae facere quod distinctio illo,
                      minima aut quisquam? Animi quae necessitatibus corporis
                      voluptate ut.
                    </div>
                  </li>
                </ul>
              </div>
              <div className="w-full relative bg-putih text-3xl">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="h-14 w-14 mt-2 rounded-full bg-putih border-2 border-hijau ml-1 overflow-hidden  hover:bg-hijau duration-500 hover:shadow-black shadow-md focus:outline-none"
                    onClick={modalNewCommentHandler}
                  >
                    <ChatAltIcon className="h-full w-full p-2 hover:text-white " />
                  </button>
                  {/* <span className="text-xs ml-5">
                    Leave a comment on this recipe!
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Recipe;
