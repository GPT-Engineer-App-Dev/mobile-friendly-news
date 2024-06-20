import { useEffect, useState } from "react";
import { Container, Text, VStack, Input, Box, Link, Badge, useColorMode, Button } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: topStoryIds } = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const top5StoryIds = topStoryIds.slice(0, 5);
        const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Button onClick={toggleColorMode} alignSelf="flex-end">
          {colorMode === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <Input placeholder="Search stories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="lg" width="100%">
            <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
            <Badge ml="1" colorScheme="green">{story.score} upvotes</Badge>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;