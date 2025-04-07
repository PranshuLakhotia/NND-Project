import React, { useEffect, useState, useRef } from 'react';
import { Box, Card, CardContent, Grid, Typography, Paper } from '@mui/material';
import { AlertTriangle, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Topology } from 'topojson-specification';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon: Icon, subtitle }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon size={24} style={{ marginRight: '8px' }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const AttackActivity = () => {
  const data = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Attack Attempts',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 45) + 15),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Attack attempts over the last 30 days',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attack Activity
        </Typography>
        <Box sx={{ height: 300 }}>
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

const AttackTypes = () => {
  const data = {
    labels: [
      'Internal ARP Spoofing',
      'External ARP Spoofing',
      'Man-in-the-Middle',
      'Denial of Service',
      'MAC Flooding',
    ],
    datasets: [
      {
        data: [30, 20, 25, 15, 10], 
        backgroundColor: [
          '#8b5cf6',
          '#6366f1',
          '#3b82f6',
          '#a78bfa',
          '#c4b5fd',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#fff', 
        },
      },
      title: {
        display: true,
        text: 'ARP Spoofing Attack Types',
        color: '#f0f0f0', 
      },
      tooltip: {
        bodyColor: '#fff', 
        titleColor: '#fff', 
      },
    },
  };
  

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ARP Spoofing Types
        </Typography>
        <Box sx={{ height: 300 }}>
          <Pie data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};


const AttackMap = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [worldData, setWorldData] = useState<Topology | null>(null);


  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setWorldData(data);
      });
  }, []);

  useEffect(() => {
    if (worldData && svgRef.current) {
      const width = svgRef.current.clientWidth;
      const height = 300;

      // Clear previous content
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      // Add gradient definition
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "map-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#132f4c");

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#173a5e");

      const projection = d3.geoMercator()
        .scale(width / 6)
        .center([0, 20])
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      const countries = feature(
        worldData as Topology,
        worldData.objects.countries
      ) as unknown as FeatureCollection<Geometry>;



      // Add a background rectangle
      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#map-gradient)");

      const mapGroup = svg.append("g");

      // Add countries
      mapGroup.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-width', 0.5);

      // Sample attack
      const attacks = [
        { country: "United States", lat: 37.0902, lng: -95.7129, count: 245 },
        { country: "Russia", lat: 61.524, lng: 105.3188, count: 189 },
        { country: "China", lat: 35.8617, lng: 104.1954, count: 156 },
        { country: "Brazil", lat: -14.235, lng: -51.9253, count: 87 },
        { country: "India", lat: 20.5937, lng: 78.9629, count: 76 }
      ];

      const attackPoints = mapGroup.selectAll('circle')
        .data(attacks)
        .enter()
        .append('circle')
        .attr('cx', d => {
          const point = projection([d.lng, d.lat]);
          return point ? point[0] : 0;
        })
        .attr('cy', d => {
          const point = projection([d.lng, d.lat]);
          return point ? point[1] : 0;
        })        
        .attr('r', d => Math.sqrt(d.count) / 2)
        .attr('fill', 'url(#map-gradient)')
        .attr('stroke', '#8b5cf6')
        .attr('stroke-width', 2)
        .attr('opacity', 0.7)
        .style('filter', 'url(#glow)');

      // Add glow effect
      const defs = svg.append('defs');
      const filter = defs.append('filter')
        .attr('id', 'glow');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');

      // Add tooltips
      attackPoints.append('title')
        .text(d => `${d.country}: ${d.count} attacks`);

      // Add pulse animation
      attackPoints.each(function() {
        const point = d3.select(this);
        const radius = parseFloat(point.attr('r'));
        
        const pulse = mapGroup.append('circle')
          .attr('cx', point.attr('cx'))
          .attr('cy', point.attr('cy'))
          .attr('r', radius)
          .attr('stroke', '#8b5cf6')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .style('opacity', 1);

        function pulseAnimation() {
          pulse
            .transition()
            .duration(2000)
            .attr('r', radius * 3)
            .style('opacity', 0)
            .on('end', function() {
              d3.select(this)
                .attr('r', radius)
                .style('opacity', 1)
                .call(() => pulseAnimation());
            });
        }

        pulseAnimation();
      });
    }
  }, [worldData]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attack Map
        </Typography>
        <Box sx={{ height: 300 }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Attacks"
            value="1,284"
            icon={AlertTriangle}
            subtitle="+24% from last week"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Unique IPs"
            value="342"
            icon={Globe}
            subtitle="From 28 countries"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="SQL Injections"
            value="156"
            icon={Database}
            subtitle="High severity attacks"
          />
        </Grid>

        <Grid item xs={12}  md={8}>
          <AttackActivity />
        </Grid>
        <Grid item xs={12} md={4}>
          <AttackTypes />
        </Grid>
        <Grid item xs={12}>
          <AttackMap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;