import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate } from "react-router-dom";
import { RANDOM_IMAGES_URL, SEARCH_IMAGES_URL } from "./constants";
import { splitArrayToThree } from "./helper";
import Image from "./components/Image";
import { IImage } from "./types";

const INITIAL_STATE = [[], [], []];

function App() {
  const [images, setImages] = useState<IImage[][]>(INITIAL_STATE);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const navigate = useNavigate();
  const { search } = useLocation();

  const inputValue = useMemo(() => {
    let searchParams = new URLSearchParams(search);
    return searchParams.get("query") || "";
  }, [search]);

  const handleImages = (imageArr: IImage[]) => {
    // gets a 2D array with 3 indexs
    const splittedArray = splitArrayToThree(imageArr);

    setImages((prev: IImage[][]) =>
      prev.map((prevArr: IImage[], index: number) => [
        ...prevArr,
        ...splittedArray[index],
      ])
    );
  };

  const getSearch = useCallback(() => {
    if (!inputValue) {
      return;
    }
    fetch(
      `${SEARCH_IMAGES_URL}?client_id=${
        process.env.REACT_APP_CLIENT_ID
      }&page=${pageNumber}&per_page=18&query=${inputValue || ""}`
    ).then(async (res) => {
      const data = await res.json();
      handleImages(data.results);
    });
  }, [inputValue, pageNumber]);

  const fetchMore = useCallback(() => {
    fetch(
      `${RANDOM_IMAGES_URL}?client_id=${process.env.REACT_APP_CLIENT_ID}&page=${pageNumber}`
    ).then(async (res) => {
      const data = await res.json();

      handleImages(data);
    });
  }, [pageNumber]);

  useEffect(() => {
    if (inputValue) {
      getSearch();
    } else {
      fetchMore();
    }
  }, [fetchMore, inputValue, getSearch]);

  return (
    <div className="App">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          // @ts-ignore
          if (e.target.search.value === inputValue) {
            return;
          }
          // @ts-ignore
          if (e.target.search.value) {
            let searchParams = new URLSearchParams(search);
            // @ts-ignore
            searchParams.set("query", e.target.search.value);
            navigate({ search: searchParams.toString() });
            setImages([[], [], []]);
          } else {
            navigate({ search: "" });
            setImages([[], [], []]);
          }
        }}
        className="m-3 d-flex justify-content-center"
      >
        <div className="mw-75 w-100 d-flex">
          <Form.Control
            id="search"
            aria-describedby="search"
            defaultValue={inputValue}
          />
          <Button type="submit" className="mx-3">
            Submit
          </Button>
        </div>
      </Form>
      <InfiniteScroll
        dataLength={images[0]?.length + images[1].length + images[2].length}
        next={() => setTimeout(() => setPageNumber((prev) => prev + 1), 1000)}
        hasMore={true}
        loader={
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="scroll">
          {images.map((imagesCol: IImage[]) => (
            <div className="d-flex flex-wrap flex-column w-100 mx-3">
              {imagesCol.map((image: IImage) => {
                return <Image image={image} key={image.id} />;
              })}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;
