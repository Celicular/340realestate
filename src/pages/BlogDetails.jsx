import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  fetchBlogById, 
  selectCurrentBlog, 
  selectBlogsLoading, 
  selectBlogsError,
  clearCurrentBlog 
} from "../redux/slices/blogslice";
import { updateBlog } from "../firebase/firestore";
import newImage from "../assets/new.jpg";
import logo from "../assets/logo.png";

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Redux state
  const blog = useSelector(selectCurrentBlog);
  const loading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);
  
  const [viewsUpdated, setViewsUpdated] = useState(false);

  useEffect(() => {
    // Clear current blog on unmount
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    // Update view count for Firebase blogs only (once per visit)
    if (blog && !blog.isHardcoded && !viewsUpdated && !loading) {
      const updateViews = async () => {
        try {
          await updateBlog(blog.id, { views: (blog.views || 0) + 1 });
          setViewsUpdated(true);
        } catch (error) {
          console.error('Error updating views:', error);
        }
      };
      updateViews();
    }
  }, [blog, viewsUpdated, loading]);

  const formatDate = (dateField) => {
    if (!dateField) return "Recent";

    let date;
    if (dateField.seconds) {
      // Firestore timestamp
      date = new Date(dateField.seconds * 1000);
    } else if (dateField instanceof Date) {
      // Regular Date object
      date = dateField;
    } else if (typeof dateField === "string") {
      // String date
      date = new Date(dateField);
    } else {
      return "Recent";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading blog...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">🚫 {error || "Blog not found."}</p>
      </div>
    );
  }

  // Description parsing utility
  const renderDescription = (desc) => {
    // Special layout for the welcome blog
    if (blog?.id === "340-real-estate-first-blog") {
      const lines = desc.split("\n");
      const sections = [];
      let currentSection = [];
      let currentSectionType = "intro";

      // Parse the content into sections
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("##")) {
          // Save previous section
          if (currentSection.length > 0) {
            sections.push({
              type: currentSectionType,
              content: currentSection,
            });
            currentSection = [];
          }
          // Start new section
          if (line.includes("Meet Our Broker and Owner")) {
            currentSectionType = "broker";
          } else if (line.includes("340 Real Estate Team")) {
            currentSectionType = "team";
          } else if (line.includes("Great Feature")) {
            currentSectionType = "features";
          } else {
            currentSectionType = "other";
          }
          currentSection.push(line);
        } else {
          currentSection.push(line);
        }
      }
      // Add final section
      if (currentSection.length > 0) {
        sections.push({ type: currentSectionType, content: currentSection });
      }

      // Helper function to render content with links
      const renderContent = (content) => {
        return content
          .map((line, idx) => {
            if (line.startsWith("##")) {
              return null; // Skip headers as we'll handle them separately
            } else if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <p key={idx} className="text-lg font-bold mb-3">
                  {line.replace(/\*\*/g, "").trim()}
                </p>
              );
            } else if (line.includes("[") && line.includes("](")) {
              // Handle markdown links
              const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
              const parts = line.split(linkRegex);
              return (
                <p key={idx} className="text-lg mb-3 leading-relaxed">
                  {parts.map((part, partIndex) => {
                    if (partIndex % 3 === 1) {
                      return (
                        <a
                          key={partIndex}
                          href={parts[partIndex + 1]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-100 underline"
                        >
                          {part}
                        </a>
                      );
                    } else if (partIndex % 3 === 2) {
                      return null;
                    }
                    return part;
                  })}
                </p>
              );
            } else if (line.trim() === "") {
              return null;
            } else {
              return (
                <p
                  key={idx}
                  className="text-lg mb-3 leading-relaxed opacity-90"
                >
                  {line.trim()}
                </p>
              );
            }
          })
          .filter(Boolean);
      };

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Layout - Image Left, Content Right */}
          {sections
            .filter((s) => s.type === "intro")
            .map((section, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-3xl lg:text-4xl flex justify-center items-center font-serif font-bold text-[#3c6a72]">
                  {section.title || "Welcome to 340 Real Estate's New Website!"}
                </h2>
                <div className="text-gray-700 justify-center items-center">
                  {renderContent(section.content)}
                </div>
              </div>
            ))}
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
            {/* Large Image */}

            <div className="lg:w-1/2 flex-shrink-0">
              <div className="relative">
                <img
                  src={newImage}
                  alt="340 Real Estate Team"
                  className="w-full h-[490px] object-cover rounded-2xl shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2 space-y-8 ">
              {/* Introduction Section */}
              {sections.find((s) => s.type === "broker") && (
                <div className="w-full mb-10 mx-auto bg-gradient-to-r from-[#3c6a72] to-[#3d8b99] rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-4 text-center">
                    Meet Our Broker and Owner
                  </h3>
                  <div className="text-center">
                    {renderContent(
                      sections.find((s) => s.type === "broker").content
                    )}
                  </div>
                </div>
              )}
              {/* {sections.find(s => s.type === 'intro') && (
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3c6a72]">
                    Welcome to 340 Real Estate's New Website!
                  </h2>
                  <div className="text-gray-700">
                    {renderContent(sections.find(s => s.type === 'intro').content)}
                  </div>
                </div>
              )} */}
            </div>
          </div>
          {/* Broker Section - Full width and centered */}

          {/* Team Section */}
          {sections.find((s) => s.type === "team") && (
            <div className="mb-16">
              <h3 className="text-3xl font-serif font-bold text-[#3c6a72] mb-8 text-center">
                The 340 Real Estate Team
              </h3>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-gray-700">
                  {renderContent(
                    sections.find((s) => s.type === "team").content
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features and remaining content */}
          {sections
            .filter((s) => s.type === "features" || s.type === "other")
            .map((section, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-16"
              >
                {section.content.find((line) => line.startsWith("##")) && (
                  <h3 className="text-3xl font-serif font-bold text-[#3c6a72] mb-6 text-center">
                    {section.content
                      .find((line) => line.startsWith("##"))
                      .replace("##", "")
                      .trim()}
                  </h3>
                )}
                <div className="text-gray-700">
                  {renderContent(section.content)}
                </div>
              </div>
            ))}
        </div>
      );
    }

    // Regular blog rendering for other blogs
    const lines = desc.split("\n");
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Special handling for "Meet Our Broker and Owner" section
      if (line.trim() === "## Meet Our Broker and Owner") {
        // Find the content of this section (next few paragraphs until next ## or end)
        let sectionContent = [];
        i++; // Skip the heading
        while (i < lines.length && !lines[i].startsWith("##")) {
          if (lines[i].trim() !== "") {
            sectionContent.push(lines[i]);
          }
          i++;
        }

        // Create special layout with image on left and text on right
        elements.push(
          <div key={`broker-section-${elements.length}`} className="my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Meet Our Broker and Owner
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src={newImage}
                  alt="Tammy Donnelly - Broker and Owner"
                  className="h-48 w-auto object-contain rounded-lg shadow-lg bg-gray-50"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                {sectionContent.map((contentLine, idx) => (
                  <p key={idx} className="text-gray-700 text-base mb-3">
                    {contentLine.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
        i--; // Adjust because we'll increment at the end of the loop
      } else if (line.startsWith("##")) {
        elements.push(
          <h2
            key={`heading-${elements.length}`}
            className="text-2xl font-bold mt-6 mb-2 text-gray-800"
          >
            {line.replace("##", "").trim()}
          </h2>
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        // Handle bold text
        elements.push(
          <p
            key={`bold-${elements.length}`}
            className="text-gray-700 text-base mb-3 font-bold"
          >
            {line.replace(/\*\*/g, "").trim()}
          </p>
        );
      } else if (line.startsWith("-")) {
        elements.push(
          <li
            key={`list-${elements.length}`}
            className="ml-5 list-disc text-gray-600 text-base"
          >
            {line.replace("-", "").trim()}
          </li>
        );
      } else if (line.includes("[") && line.includes("](")) {
        // Handle markdown links and images
        if (line.startsWith("![")) {
          // Handle markdown images: ![alt text](image-url)
          const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
          const match = line.match(imageRegex);
          if (match) {
            const [, altText, imageSrc] = match;

            // Hardcode image for the welcome blog
            let finalImageSrc = imageSrc;
            console.log("Blog ID:", blog?.id, "Image src:", imageSrc); // Debug log

            if (
              blog?.id === "340-real-estate-first-blog" &&
              imageSrc === "new.jpg"
            ) {
              console.log("Using newImage for welcome blog"); // Debug log
              finalImageSrc = newImage;
            } else {
              // Handle imported images from assets or public URL paths
              if (imageSrc.startsWith("data:") || imageSrc.startsWith("/static/")) {
                // This is an imported image from assets (webpack processed)
                finalImageSrc = imageSrc;
              } else if (imageSrc.startsWith("/")) {
                finalImageSrc = imageSrc;
              } else if (imageSrc.startsWith("blog/")) {
                // Handle legacy public URL references
                const publicUrl = process.env.PUBLIC_URL || '';
                finalImageSrc = `${publicUrl}/${imageSrc}`;
              } else {
                finalImageSrc = imageSrc.startsWith("/")
                  ? imageSrc
                  : `/${imageSrc}`;
              }
            }

            elements.push(
              <div
                key={`image-${elements.length}`}
                className="my-6 flex justify-center"
              >
                <img
                  src={finalImageSrc}
                  alt={altText}
                  className="max-w-sm w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            );
          }
        } else {
          // Handle markdown links
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          const parts = line.split(linkRegex);
          elements.push(
            <p
              key={`link-${elements.length}`}
              className="text-gray-700 text-base mb-3"
            >
              {parts.map((part, partIndex) => {
                if (partIndex % 3 === 1) {
                  // This is link text
                  return (
                    <a
                      key={partIndex}
                      href={parts[partIndex + 1]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {part}
                    </a>
                  );
                } else if (partIndex % 3 === 2) {
                  // This is the URL, skip it as it's already used
                  return null;
                }
                // Regular text
                return part;
              })}
            </p>
          );
        }
      } else if (line.trim() === "") {
        elements.push(<br key={`br-${elements.length}`} />);
      } else {
        elements.push(
          <p
            key={`text-${elements.length}`}
            className="text-gray-700 text-base mb-3"
          >
            {line.trim()}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  return (
    <div>
      <motion.div
        className="h-[80vh] w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-700"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
              {blog.title}
            </h1>
            {blog.subtitle && (
              <p className="text-gray-200 text-xl md:text-2xl mb-6">
                {blog.subtitle}
              </p>
            )}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-300">
              <span>By {blog.author?.name || blog.author || "Admin"}</span>
              <span>•</span>
              <span>{formatDate(blog.createdAt || blog.publishedAt)}</span>
              <span>•</span>
              <span>{blog.views || 0} views</span>
              {blog.category && (
                <>
                  <span>•</span>
                  <span className="bg-blue-600 px-2 py-1 rounded">
                    {blog.category}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Blog Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="space-y-4 text-gray-700 leading-relaxed">
            {renderDescription(blog.description)}
          </div>
        </motion.div>

        {/* Author Info */}
        {blog.author && (
          <motion.div
            className="border-t pt-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-gray-200">
                <img 
                  src={logo} 
                  alt="340 Real Estate Logo" 
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {blog.author.name || blog.author}
                </h3>
                {blog.author.role && (
                  <p className="text-sm text-gray-600">{blog.author.role}</p>
                )}
                {blog.author.email && (
                  <p className="text-sm text-gray-500">{blog.author.email}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
