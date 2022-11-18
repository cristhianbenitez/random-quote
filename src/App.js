import React from 'react';
import './App.css';
import axios from 'axios';

const api = 'https://quote-garden.herokuapp.com/api/v3/quotes';

function App() {
  const [quote, setQuote] = React.useState({});
  const [authorQuotes, setAuthorQuotes] = React.useState([]);
  const [showAuthorQuotes, setShowAuthorQuotes] = React.useState(false);
  const calledOnce = React.useRef(false);

  const getNewRandomQuote = async () => {
    const { data } = await axios(`${api}/random`);
    const randomQuote = data.data[0];
    setQuote(randomQuote);
    setShowAuthorQuotes(false);
  };

  const getAllQuotes = async (author) => {
    const searchParams = encodeURIComponent(author);
    const { data } = await axios(`${api}?author=${searchParams}`);
    setAuthorQuotes(authorQuotes.concat(data.data));
    setShowAuthorQuotes(true);
  };

  React.useEffect(() => {
    if (calledOnce.current) {
      return;
    }
    if (!quote.author) {
      getNewRandomQuote();
      calledOnce.current = true;
    }
  }, [quote]);

  if (!quote.quoteText) return;

  return (
    <div className="app">
      <header className="header">
        <span onClick={getNewRandomQuote} className="random-btn">
          random
          <i
            className="material-symbols-outlined "
            style={{ fontSize: '22px' }}
          >
            autorenew
          </i>
        </span>
      </header>

      <main className="main">
        <div className="quote">
          {showAuthorQuotes !== true ? (
            <div className="quote__randomQuote">
              <p className="quote__text">“{quote.quoteText}”</p>

              <div
                className="quote__info"
                onClick={() => {
                  getAllQuotes(quote.quoteAuthor);
                }}
              >
                <div className="quote__info__left-box">
                  <p className="quote__info__author">{quote.quoteAuthor}</p>
                  <span className="quote__info__genre">{quote.quoteGenre}</span>
                </div>
                <div className="quote__info__right-box">
                  <i className="material-symbols-outlined quote__info__arrow">
                    trending_flat
                  </i>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="quote__author">{quote.quoteAuthor}</h2>

              {authorQuotes.map(({ quoteText, _id }) => (
                <p key={_id} className="quote__text">
                  “{quoteText}”
                </p>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
