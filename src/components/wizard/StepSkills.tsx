import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// схема
const schema = z.object({
  skills: z.array(z.string().min(1)).min(1, "Добавьте хотя бы один навык")
});

type FormData = z.infer<typeof schema>;

interface StepSkillsProps {
  onNext: () => void;
  onBack: () => void;
}

// Предустановленные навыки по категориям
const skillCategories = {
  frontend: [
    "React",
    "Vue.js",
    "Angular",
    "Svelte",
    "Solid.js",
    "Astro",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Ant Design",
    "shadcn/ui",
    "Chakra UI",
    "Styled Components",
    "Emotion",
    "SASS/SCSS",
    "Next.js",
    "Nuxt.js",
    "Remix",
    "SvelteKit",
    "Qwik",
    "Redux",
    "Zustand",
    "Jotai",
    "Recoil",
    "Context API",
    "MobX",
    "Pinia",
    "Vuex",
    "Webpack",
    "Vite",
    "Parcel",
    "Turbopack",
    "esbuild",
    "Rollup",
    "Jest",
    "Vitest",
    "Cypress",
    "Playwright",
    "Testing Library",
    "Storybook",
    "Figma",
    "Framer Motion",
    "Three.js",
    "Babylon.js",
    "D3.js",
    "Chart.js",
    "PWA",
    "Web Components",
    "GraphQL Client",
    "Apollo Client",
    "React Query",
    "SWR",
    "Axios",
    "Fetch API"
  ],
  backend: [
    "Node.js",
    "Express.js",
    "Fastify",
    "Hapi",
    "NestJS",
    "Koa",
    "Egg.js",
    "Python",
    "Django",
    "FastAPI",
    "Flask",
    "Celery",
    "Java",
    "Spring Boot",
    "Spring Framework",
    "Hibernate",
    "Maven",
    "Gradle",
    "C#",
    ".NET Core",
    "ASP.NET",
    "Entity Framework",
    "Go",
    "Gin",
    "Echo",
    "Fiber",
    "Rust",
    "Actix-web",
    "Rocket",
    "Tokio",
    "Cargo",
    "PHP",
    "Laravel",
    "Symfony",
    "Doctrine",
    "Composer",
    "Ruby",
    "Rails",
    "Sinatra",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "Cassandra",
    "DynamoDB",
    "Firebase Realtime DB",
    "Prisma",
    "TypeORM",
    "Sequelize",
    "SQLAlchemy",
    "Mongoose",
    "Docker",
    "Kubernetes",
    "Docker Compose",
    "AWS",
    "Azure",
    "Google Cloud",
    "DigitalOcean",
    "Heroku",
    "Railway",
    "Vercel",
    "Netlify",
    "GraphQL",
    "REST API",
    "WebSocket",
    "gRPC",
    "Message Queue",
    "RabbitMQ",
    "Kafka",
    "Redis Queue",
    "Jest",
    "Mocha",
    "Pytest",
    "JUnit",
    "Git",
    "GitHub Actions",
    "GitLab CI/CD",
    "Jenkins",
    "CircleCI",
    "Travis CI",
    "Nginx",
    "Apache",
    "PM2",
    "Supervisor"
  ],
  fullstack: [
    "MERN Stack",
    "MEAN Stack",
    "LAMP Stack",
    "JAM Stack",
    "T3 Stack",
    "TALL Stack",
    "MERNG Stack",
    "Next.js",
    "Nuxt.js",
    "Remix",
    "SvelteKit",
    "Astro",
    "Qwik",
    "Laravel",
    "Ruby on Rails",
    "Django",
    "Spring Boot",
    "ASP.NET Core",
    "Firebase",
    "Supabase",
    "Auth0",
    "Clerk",
    "NextAuth.js",
    "Passport.js",
    "JWT",
    "OAuth 2.0",
    "SAML",
    "AWS",
    "AWS Lambda",
    "AWS RDS",
    "AWS S3",
    "AWS DynamoDB",
    "AWS EC2",
    "Azure",
    "Azure App Service",
    "Azure SQL Database",
    "Azure Functions",
    "Google Cloud",
    "Google Cloud Run",
    "Google Cloud SQL",
    "Heroku",
    "Vercel",
    "Netlify",
    "Railway",
    "Render",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "CI/CD",
    "GitHub Actions",
    "GitLab CI",
    "Jenkins",
    "REST API",
    "GraphQL",
    "OpenAPI/Swagger",
    "Postman",
    "Insomnia",
    "Docker",
    "Docker Compose",
    "Kubernetes",
    "Helm",
    "Terraform",
    "CloudFormation",
    "Prometheus",
    "Grafana",
    "ELK Stack",
    "Sentry",
    "DataDog",
    "New Relic",
    "Notion",
    "Linear",
    "Jira",
    "Confluence",
    "Slack API",
    "Stripe API",
    "Twilio",
    "SendGrid",
    "WebRTC",
    "Socket.io",
    "Nginx",
    "Apache",
    "Load Balancing",
    "Caching",
    "CDN",
    "Cloudflare",
    "SEO Optimization",
    "Performance Monitoring",
    "A/B Testing",
    "Analytics"
  ]
};

export default function StepSkills({ onNext, onBack }: StepSkillsProps) {
  const { state, dispatch } = useResume();

  const [inputValue, setInputValue] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof skillCategories | null>(null);
  const [showCategories, setShowCategories] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: state.skills || []
    }
  });

  const skills = watch("skills");

  function handleAddSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed) return;

      if (!skills.includes(trimmed)) {
        const updated = [...skills, trimmed];
        setValue("skills", updated);
      }

      setInputValue("");
    }
  }

  function addSkillFromCategory(skill: string) {
    if (!skills.includes(skill)) {
      setValue("skills", [...skills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setValue(
      "skills",
      skills.filter((s) => s !== skill)
    );
  }

  const onSubmit = (data: FormData) => {
    dispatch({ type: "UPDATE_FIELD", field: "skills", value: data.skills });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div>
        <label className="block font-medium mb-2">Выберите категорию навыков или добавьте вручную</label>

        {/* Toggle categories */}
        <button
          type="button"
          onClick={() => setShowCategories(!showCategories)}
          className="mb-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          {showCategories ? "🔽 Скрыть категории" : "▶️ Показать категории"}
        </button>

        {/* Категории навыков */}
        {showCategories && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(Object.keys(skillCategories) as Array<keyof typeof skillCategories>).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`px-4 py-2 rounded font-medium transition ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category === "frontend" && "💻 Frontend"}
                {category === "backend" && "🔧 Backend"}
                {category === "fullstack" && "🚀 Fullstack"}
              </button>
            ))}
          </div>
        )}

        {/* Навыки из выбранной категории */}
        {activeCategory && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">
              {activeCategory === "frontend" && "💻 Frontend навыки"}
              {activeCategory === "backend" && "🔧 Backend навыки"}
              {activeCategory === "fullstack" && "🚀 Fullstack навыки"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {skillCategories[activeCategory].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkillFromCategory(skill)}
                  disabled={skills.includes(skill)}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    skills.includes(skill)
                      ? "bg-green-200 text-green-700 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  }`}
                >
                  {skills.includes(skill) ? "✓ " : "+ "}
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ручное добавление */}
        <div>
          <label className="block text-sm font-medium mb-2">Добавить навык вручную</label>
          <input
            type="text"
            value={inputValue}
            placeholder="Введите навык и нажмите Enter..."
            className="w-full border p-2 rounded"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddSkill}
          />
        </div>

        {errors.skills && (
          <p className="text-red-600 text-sm mt-1">
            {errors.skills.message as string}
          </p>
        )}
      </div>

      {/* Добавленные навыки */}
      {skills.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Ваши навыки ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2 text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 font-bold"
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
        >
          ← Назад
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Далее →
        </button>
      </div>
    </form>
  );
}
