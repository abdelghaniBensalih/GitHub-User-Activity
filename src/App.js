import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [details, setDetails] = useState({});

  const [error, setError] = useState();

  const token = process.env.REACT_APP_GITHUB_TOKEN;
  var dataFitched = false;

  function handleSubmit(e) {
    e.preventDefault();
    searchRepos();
  }

  function searchRepos() {
    setLoading(true);
    dataFitched = true;
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        authorization: `token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }
        return response.json();
      })
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
        setRepos([]);
        setLoading(false);
      });
  }

  function getRepoDetails(url) {
    fetch(url, {
      headers: {
        authorization: `token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDetails(data))
      .catch((error) => console.log(error));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <h1 className="text-xl text-center font-bold bg-white text-gray-900 py-3">
        GitHub User Activity
      </h1>
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-start mt-10 items-center  md:border-r border-orange-500">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 px-4">
            <input
              type="text"
              placeholder="Enter GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full sm:w-auto py-3 px-3 bg-gray-800 border border-orange-500 rounded-md text-white"
            />
            <button
              className="px-3 py-2 bg-orange-500 rounded-md text-white hover:bg-orange-600"
              onClick={handleSubmit}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
          <div className="mt-10 w-full px-4">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : repos.length > 0 ? (
              <>
                <div className="text-xl my-2 font-bold underline">
                  Repositories
                </div>
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-md mb-2"
                  >
                    <span>{repo.name}</span>
                    <button
                      onClick={() => getRepoDetails(repo.url)}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </>
            ) : dataFitched ? (
              <div className="text-red-500">
                No repositories found or user {username} doesn't exist
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-start items-start px-6 py-6">
          <h1 className="text-xl my-3 font-bold underline">
            Repository Details
          </h1>
          <div className="space-y-4">
            <div className="flex">
              <h2 className="text-xl font-bold">
                Name: <span className="text-lime-500">{details.name}</span>
              </h2>
            </div>
            <div className="flex">
              <h2 className="text-xl font-bold">
                Forks Count:{" "}
                <span className="text-lime-500">{details.forks_count}</span>
              </h2>
            </div>
            <div className="flex">
              <h2 className="text-xl font-semibold">
                Language:{" "}
                <span className="text-lime-500">{details.language}</span>
              </h2>
            </div>
            <div className="text-xl flex">
              <h2 className="font-semibold">
                Stars:{" "}
                <span className="text-lime-500">
                  {details.stargazers_count === 0
                    ? "No Stars"
                    : details.stargazers_count > 5
                    ? "more than 5 stars"
                    : "⭐".repeat(details.stargazers_count)}
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
