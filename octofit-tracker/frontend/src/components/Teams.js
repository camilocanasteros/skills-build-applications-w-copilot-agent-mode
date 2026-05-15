import React, { useEffect, useState } from 'react';

const getApiUrl = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const url = `${baseUrl}/api/teams/`;
  console.log('[Teams] REST API endpoint:', url);
  return url;
};

const normalizeResponse = (json) => {
  if (Array.isArray(json)) {
    return json;
  }
  if (json && Array.isArray(json.results)) {
    return json.results;
  }
  return [];
};

const renderTable = (items) => {
  if (!items.length) {
    return null;
  }

  const headers = Object.keys(items[0]).slice(0, 6);
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered align-middle mb-0">
        <thead className="table-primary">
          <tr>
            {headers.map((header) => (
              <th key={header}>{header.replace(/_/g, ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((team, index) => (
            <tr key={team.id || index}>
              {headers.map((header) => (
                <td key={header}>
                  {typeof team[header] === 'object'
                    ? JSON.stringify(team[header])
                    : team[header] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const loadData = () => {
    const url = getApiUrl();

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log('[Teams] fetched data:', json);
        setRawData(json);
        setTeams(normalizeResponse(json));
      })
      .catch((fetchError) => {
        console.error('[Teams] fetch error:', fetchError);
        setError(fetchError.message);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="card app-card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h4 mb-0">Teams</h2>
          <p className="text-muted mb-0">Team data delivered through the API.</p>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={loadData}>
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowRaw(true)}>
            View JSON
          </button>
        </div>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {!error && teams.length === 0 && (
          <div className="alert alert-info">No teams found.</div>
        )}
        {renderTable(teams)}
      </div>

      {showRaw && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Teams JSON</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowRaw(false)}
                />
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(rawData, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRaw(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </div>
      )}
    </div>
  );
}

export default Teams;
