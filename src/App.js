import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [details, setDetails] = useState({});

  const token = process.env.REACT_APP_GITHUB_TOKEN;

  function handleSubmit(e) {
    e.preventDefault();
    searchRepos();
  }

  function searchRepos() {
    setLoading(true);
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
        console.log(error.message);
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
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-start mt-10 items-center border-r border-orange-500">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-orange-500 rounded-md text-white"
          />
          <button
            className="px-6 py-2 bg-orange-500 rounded-md text-white hover:bg-orange-600"
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
        <div className="mt-10">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between px-4 py-2 bg-gray-800"
              >
                <span>{repo.name}</span>
                <button
                  onClick={() => getRepoDetails(repo.url)}
                  className="text-blue-400 hover:underline"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            !loading && <div className="text-red-500">No repositories found</div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-start items-start px-10 py-10">
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
              Language: <span className="text-lime-500">{details.language}</span>
            </h2>
          </div>
          <div className="text-xl flex">
            <h2 className="font-semibold">
              Stars:{" "}
              <span className="text-lime-500">
                {details.stargazers_count}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
