"use client";
import { fetchPortfolio, handleModal } from "@/slices/PortfolioSlice";
import { Add } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Tab, Tabs } from "@mui/material";
import PortfolioItem from "./PortfolioItem";

const Portfolio = ({ isOwnProfile, user }) => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector(
    (state) => state.portfolio.portfolios
  );
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-4">
            <div className="animate-pulse">
              {/* Thumbnail */}
              <div className="h-64 bg-gray-200 rounded-lg mb-4" />

              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

              {/* Description */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-8 w-20 bg-gray-200 rounded-full" />
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-28 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filter portfolios based on status
  const publishedPortfolios = data.filter(
    (portfolio) => portfolio.status === "PUBLISHED"
  );
  const draftPortfolios = data.filter(
    (portfolio) => portfolio.status === "DRAFT"
  );

  // Get current portfolios based on active tab
  const currentPortfolios =
    tabValue === 0 ? publishedPortfolios : draftPortfolios;

  return (
    <>
      <div className="w-full">


        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="portfolio tabs"
          >
            <Tab
              label={`Published (${publishedPortfolios.length})`}
              id="portfolio-tab-0"
              aria-controls="portfolio-tabpanel-0"
            />
            {isOwnProfile && (
              <Tab
                label={`Drafts (${draftPortfolios.length})`}
                id="portfolio-tab-1"
                aria-controls="portfolio-tabpanel-1"
              />
            )}
          </Tabs>
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPortfolios.length > 0 ? (
            currentPortfolios.map((portfolio, index) => {
              return <PortfolioItem portfolio={portfolio} key={index} />;
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">
              {tabValue === 0
                ? "No published portfolios found."
                : "No draft portfolios found."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
