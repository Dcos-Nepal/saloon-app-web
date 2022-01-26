import { Route, Routes } from "react-router-dom";

import QuotesList from "./list";
import ClientQuoteAdd from "./add";
import ClientQuoteDetail from "./detail";
import { endpoints } from "common/config";

const Quotes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<QuotesList />} />
        <Route path={endpoints.admin.quotes.add} element={<ClientQuoteAdd />} />
        <Route path={endpoints.admin.quotes.edit} element={<ClientQuoteAdd />} />
        <Route
          path={endpoints.admin.quotes.detail}
          element={<ClientQuoteDetail />}
        />
      </Routes>
    </>
  );
};

export default Quotes;
